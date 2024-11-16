import APIWrapper from "@server/utils/APIWrapper";
import {
  AnalyticsSectionEnum,
  DateRangeEnum,
  IAggregatedGroupAnalyticsAll,
  PatientSearchParams,
  StackedDataRecord,
  DataRecord,
} from "@/common_utils/types";
import { getUsersFiltered } from "@server/mongodb/actions/User";
import { getAggregatedAnalytics } from "@server/mongodb/actions/AggregatedAnalytics";

type RequestData = {
  filters: PatientSearchParams;
  range: DateRangeEnum;
  sections: AnalyticsSectionEnum[];
};

function isDataRecordArray(
  value: StackedDataRecord[] | DataRecord[] | object,
): value is DataRecord[] {
  return Array.isArray(value);
}

function isStackedDataRecord(
  obj: StackedDataRecord | DataRecord,
): obj is StackedDataRecord {
  return "stackedValue" in obj;
}

export const POST = APIWrapper({
  config: {
    requireToken: true,
    requireVolunteer: true,
  },
  handler: async (req) => {
    const reqbody: RequestData = (await req.json()) as RequestData;
    const { filters, range, sections } = reqbody;

    const params = Object.fromEntries(
      Object.entries(filters).filter(
        ([, val]) =>
          val !== undefined &&
          val !== null &&
          (typeof val !== "string" || val.length > 0) &&
          (val.constructor !== Array || val.length > 0),
      ),
    );


    const enumValues = new Set(Object.values(AnalyticsSectionEnum));

    if (!sections || sections.some((section) => !enumValues.has(section))) {
      throw new Error("Invalid section in request");
    }

    const updatedSections = sections.includes(AnalyticsSectionEnum.OVERALL)
      ? Object.values(AnalyticsSectionEnum)
      : Array.from(new Set(sections));

    const users = await getUsersFiltered({
      params,
      searchall: true,
      onlyids: true,
    });

    if (users === undefined) {
      throw new Error("No patients found with parameters");
    }

    const usersLength = users.data.length;

    const groupAnalytics: Partial<IAggregatedGroupAnalyticsAll> =
      {} as Partial<IAggregatedGroupAnalyticsAll>;

    // const promises = users.data.map(async (element) => {
    //   const data = await getAggregatedAnalytics(
    //     element._id,
    //     element.name,
    //     range,
    //     updatedSections,
    //   );
    //   // Return whatever data you need from getAggregatedAnalytics
    //   return data;
    // });

    // const aggregatedDataArray = await Promise.all(promises);

    const usersids = users.data.map((element) => element._id);


    const aggregatedDataObject = await getAggregatedAnalytics(
      usersids,
      range,
      updatedSections,
    );

    const aggregatedDataArray = aggregatedDataObject.analytics;



    aggregatedDataArray.forEach((data) => {
      // for (const userdatadict of users.data) {
      //   const data = await getAggregatedAnalytics(
      //     userdatadict._id,
      //     userdatadict.name,
      //     range,
      //     updatedSections,
      //   );
      // console.log(data.overall!.name)

      if (data.overall !== undefined) {
        if (groupAnalytics.overall === undefined) {
          groupAnalytics.overall = {
            totalUsers: 0,
            activeUsers: 0,
            totalSessionsCompleted: 0,
            streakHistory: [],
            lastSession: {
              mathQuestionsCompleted: 0,
              wordsRead: 0,
              promptsCompleted: 0,
              triviaQuestionsCompleted: 0,
            },
          };
        }
        groupAnalytics.overall.totalUsers += 1;
        groupAnalytics.overall.activeUsers += data.overall.active ? 1 : 0;
        groupAnalytics.overall.totalSessionsCompleted +=
          data.overall.totalSessionsCompleted / usersLength;
        groupAnalytics.overall.lastSession.mathQuestionsCompleted +=
          data.overall.lastSession.mathQuestionsCompleted / usersLength;
        groupAnalytics.overall.lastSession.wordsRead +=
          data.overall.lastSession.wordsRead / usersLength;
        groupAnalytics.overall.lastSession.promptsCompleted +=
          data.overall.lastSession.promptsCompleted / usersLength;
        groupAnalytics.overall.lastSession.triviaQuestionsCompleted +=
          data.overall.lastSession.triviaQuestionsCompleted / usersLength;

        const count = 0;
        data.overall.streakHistory.forEach((element: DataRecord) => {
          const modifiedElement = { ...element };
          modifiedElement.value /= usersLength;

          if (groupAnalytics.overall!.streakHistory[count] === undefined) {
            groupAnalytics.overall!.streakHistory.push(modifiedElement);
          } else {
            groupAnalytics.overall!.streakHistory[count].value +=
              modifiedElement.value;
          }
        });

        if (data.overall.active) {
          groupAnalytics.overall.activeUsers += 1;
        }
      }
      if (data.math !== undefined) {
        Object.entries(data.math).forEach(([key, value]) => {
          if (groupAnalytics.math === undefined) {
            groupAnalytics.math = {
              avgAccuracy: [],
              avgDifficultyScore: [],
              avgQuestionsCompleted: [],
              avgTimePerQuestion: [],
              lastSession: {
                accuracy: 0,
                difficultyScore: 0,
                questionsCompleted: 0,
                timePerQuestion: 0,
              },
            };
          }
          // Handle both cases
          let drvalue: DataRecord[];
          let objval: {
            accuracy: number;
            difficultyScore: number;
            questionsCompleted: number;
            timePerQuestion: number;
          };

          if (isDataRecordArray(value)) {
            drvalue = value;
            let count = 0;
            drvalue.forEach((element: DataRecord) => {
              const modifiedElement = { ...element };
              modifiedElement.value /= usersLength;
              if (
                (
                  groupAnalytics.math![
                    key as keyof typeof groupAnalytics.math
                  ] as DataRecord[]
                )[count] === undefined
              ) {
                (
                  groupAnalytics.math![
                    key as keyof typeof groupAnalytics.math
                  ] as DataRecord[]
                ).push(modifiedElement);
              } else {
                (
                  groupAnalytics.math![
                    key as keyof typeof groupAnalytics.math
                  ] as DataRecord[]
                )[count].value += modifiedElement.value;
              }

              count += 1;
            });
          } else {
            objval = value;
            groupAnalytics.math.lastSession.accuracy +=
              objval.accuracy / usersLength;
            groupAnalytics.math.lastSession.difficultyScore +=
              objval.difficultyScore / usersLength;
            groupAnalytics.math.lastSession.questionsCompleted +=
              objval.questionsCompleted / usersLength;
            groupAnalytics.math.lastSession.timePerQuestion +=
              objval.timePerQuestion / usersLength;
          }
        });
        // for (const [key, value] of Object.entries(data.math)) {

        // }
      }

      if (data.reading !== undefined) {
        Object.entries(data.reading).forEach(([key, value]) => {
          if (groupAnalytics.reading === undefined) {
            groupAnalytics.reading = {
              sessionCompletion: [],
              avgWordsPerMin: [],
              avgPassagesRead: [],
              avgTimePerPassage: [],
              lastSession: {
                passagesRead: 0,
                timePerPassage: 0,
              },
            };
          }
          // Handle both cases
          let drvalue: DataRecord[];
          let objval: {
            passagesRead: number;
            timePerPassage: number;
          };

          if (isDataRecordArray(value)) {
            drvalue = value;
            let count = 0;
            drvalue.forEach((element: DataRecord | StackedDataRecord) => {
              const modifiedElement = { ...element };
              modifiedElement.value /= usersLength;

              if (isStackedDataRecord(modifiedElement)) {
                modifiedElement.stackedValue /= usersLength;
              }
              if (
                (
                  groupAnalytics.reading![
                    key as keyof typeof groupAnalytics.reading
                  ] as DataRecord[]
                )[count] === undefined
              ) {
                (
                  groupAnalytics.reading![
                    key as keyof typeof groupAnalytics.reading
                  ] as DataRecord[]
                ).push(modifiedElement);
              } else {
                (
                  groupAnalytics.reading![
                    key as keyof typeof groupAnalytics.reading
                  ] as DataRecord[]
                )[count].value += modifiedElement.value;
                if (isStackedDataRecord(modifiedElement)) {
                  (
                    groupAnalytics.reading![
                      key as keyof typeof groupAnalytics.reading
                    ] as StackedDataRecord[]
                  )[count].stackedValue += modifiedElement.stackedValue;
                }
              }

              count += 1;
            });
          } else {
            objval = value;
            groupAnalytics.reading.lastSession.passagesRead +=
              objval.passagesRead / usersLength;
            groupAnalytics.reading.lastSession.timePerPassage +=
              objval.timePerPassage / usersLength;
          }
        });
      }

      if (data.writing !== undefined) {
        Object.entries(data.writing).forEach(([key, value]) => {
          if (groupAnalytics.writing === undefined) {
            groupAnalytics.writing = {
              sessionCompletion: [],
              avgPromptsAnswered: [],
              avgTimePerQuestion: [],
              lastSession: {
                promptsAnswered: 0,
                timePerPrompt: 0,
              },
            };
          }
          // Handle both cases
          let drvalue: DataRecord[];
          let objval: {
            promptsAnswered: number;
            timePerPrompt: number;
          };

          if (isDataRecordArray(value)) {
            drvalue = value;
            let count = 0;
            drvalue.forEach((element: DataRecord | StackedDataRecord) => {
              const modifiedElement = { ...element };
              modifiedElement.value /= usersLength;

              if (isStackedDataRecord(modifiedElement)) {
                modifiedElement.stackedValue /= usersLength;
              }

              if (
                (
                  groupAnalytics.writing![
                    key as keyof typeof groupAnalytics.writing
                  ] as DataRecord[]
                )[count] === undefined
              ) {
                (
                  groupAnalytics.writing![
                    key as keyof typeof groupAnalytics.writing
                  ] as DataRecord[]
                ).push(modifiedElement);
              } else {
                (
                  groupAnalytics.writing![
                    key as keyof typeof groupAnalytics.writing
                  ] as DataRecord[]
                )[count].value += modifiedElement.value;
                if (isStackedDataRecord(modifiedElement)) {
                  (
                    groupAnalytics.writing![
                      key as keyof typeof groupAnalytics.writing
                    ] as StackedDataRecord[]
                  )[count].stackedValue += modifiedElement.stackedValue;
                }
              }

              count += 1;
            });
          } else {
            objval = value;
            groupAnalytics.writing.lastSession.promptsAnswered +=
              objval.promptsAnswered / usersLength;
            groupAnalytics.writing.lastSession.timePerPrompt +=
              objval.timePerPrompt / usersLength;
          }
        });
      }

      if (data.trivia !== undefined) {
        Object.entries(data.trivia).forEach(([key, value]) => {
          if (groupAnalytics.trivia === undefined) {
            groupAnalytics.trivia = {
              avgAccuracy: [],
              avgQuestionsCompleted: [],
              avgTimePerQuestion: [],
              lastSession: {
                accuracy: 0,
                questionsCompleted: 0,
                timePerQuestion: 0,
              },
            };
          }
          // Handle both cases
          let drvalue: DataRecord[];
          let objval: {
            accuracy: number;
            questionsCompleted: number;
            timePerQuestion: number;
          };

          if (isDataRecordArray(value)) {
            drvalue = value;
            let count = 0;
            drvalue.forEach((element: DataRecord) => {
              const modifiedElement = { ...element };
              modifiedElement.value /= usersLength;

              if (
                (
                  groupAnalytics.trivia![
                    key as keyof typeof groupAnalytics.trivia
                  ] as DataRecord[]
                )[count] === undefined
              ) {
                (
                  groupAnalytics.trivia![
                    key as keyof typeof groupAnalytics.trivia
                  ] as DataRecord[]
                ).push(modifiedElement);
              } else {
                (
                  groupAnalytics.trivia![
                    key as keyof typeof groupAnalytics.trivia
                  ] as DataRecord[]
                )[count].value += modifiedElement.value;
              }
              count += 1;
            });
          } else {
            objval = value;
            groupAnalytics.trivia.lastSession.accuracy +=
              objval.accuracy / usersLength;
            groupAnalytics.trivia.lastSession.questionsCompleted +=
              objval.questionsCompleted / usersLength;
            groupAnalytics.trivia.lastSession.timePerQuestion +=
              objval.timePerQuestion / usersLength;
          }
        });
      }
    });

    groupAnalytics.activePatients = aggregatedDataObject.activePatients;
    groupAnalytics.totalPatients = aggregatedDataObject.totalPatients;

    return groupAnalytics;
  },
});
