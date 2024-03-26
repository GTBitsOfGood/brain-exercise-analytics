"use client";

import {
  GroupMathScreen,
  GroupReadingScreen,
  GroupWritingScreen,
  GroupOverviewReport,
  GroupTriviaScreen,
} from "@src/components/GroupDashboard";
import {
  AnalyticsSectionEnum,
  DateRangeEnum,
  IAggregatedAnalyticsAll,
  IAggregatedAnalyticsMath,
  IAggregatedAnalyticsOverall,
  IAggregatedAnalyticsReading,
  IAggregatedAnalyticsTrivia,
  IAggregatedAnalyticsWriting,
} from "@/common_utils/types";
import {
  dataBar,
  dataLine,
  dataStacked,
  numberOfQuestionData,
} from "@src/utils/patients";

import { useCallback, useEffect, useState } from "react";
import styles from "./page.module.scss";

export function Divider({ id }: { id?: string }) {
  return (
    <div
      id={id}
      style={{
        width: "100%",
        height: "2px",
        backgroundColor: "#c8c8c8",
        margin: "4.2% 0",
      }}
    />
  );
}

export default function Page({ params }: { params: { groupIds: string[] } }) {
  const [math, setMath] = useState<
    IAggregatedAnalyticsMath["math"] | undefined
  >(undefined);
  const [reading, setReading] = useState<
    IAggregatedAnalyticsReading["reading"] | undefined
  >(undefined);
  const [writing, setWriting] = useState<
    IAggregatedAnalyticsWriting["writing"] | undefined
  >(undefined);
  const [trivia, setTrivia] = useState<
    IAggregatedAnalyticsTrivia["trivia"] | undefined
  >(undefined);
  const [overall, setOverall] = useState<
    IAggregatedAnalyticsOverall["overall"] | undefined
  >(undefined);

  const [dashboardMenu, setDashboardMenu] = useState<DateRangeEnum>(
    DateRangeEnum.RECENT,
  );
  const [mathMenu, setMathMenu] = useState<DateRangeEnum>(DateRangeEnum.RECENT);
  const [readingMenu, setReadingMenu] = useState<DateRangeEnum>(
    DateRangeEnum.RECENT,
  );
  const [writingMenu, setWritingMenu] = useState<DateRangeEnum>(
    DateRangeEnum.RECENT,
  );
  const [triviaMenu, setTriviaMenu] = useState<DateRangeEnum>(
    DateRangeEnum.RECENT,
  );

  // TO BE IMPLEMENTED ONCE WE HAVE THE BACKEND ENDPOINT READY
  const retrieveAnalytics = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async <T,>(range: DateRangeEnum, sections: AnalyticsSectionEnum[]) => {
      return {
        overall: {
          streakHistory: [],
          streakLength: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          active: true,
          streak: [],
          startDate: new Date("2024-01-23T06:25:16.836Z"),
          lastSessionDate: new Date("2024-01-23T06:24:14.000Z"),
          totalSessionsCompleted: 0,
          lastSession: {
            mathQuestionsCompleted: 0,
            wordsRead: 0,
            promptsCompleted: 0,
            triviaQuestionsCompleted: 0,
          },
          name: "John Doe",
        },
        math: {
          avgAccuracy: [
            {
              interval: "Feb 19",
              value: 0.8,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          avgDifficultyScore: [
            {
              interval: "Feb 19",
              value: 2,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          avgQuestionsCompleted: [
            {
              interval: "Feb 19",
              value: 5,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          avgTimePerQuestion: [
            {
              interval: "Feb 19",
              value: 5,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          lastSession: {
            accuracy: 0,
            difficultyScore: 0,
            questionsCompleted: 0,
            timePerQuestion: 0,
          },
        },
        trivia: {
          avgAccuracy: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          avgQuestionsCompleted: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          avgTimePerQuestion: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          lastSession: {
            accuracy: 0,
            questionsCompleted: 0,
            timePerQuestion: 0,
          },
        },
        reading: {
          sessionCompletion: [
            {
              interval: "Feb 19",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
              stackedValue: 0,
            },
          ],
          avgWordsPerMin: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          avgPassagesRead: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          avgTimePerPassage: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          lastSession: {
            passagesRead: 0,
            timePerPassage: 0,
            completed: true,
          },
        },
        writing: {
          sessionCompletion: [
            {
              interval: "Feb 19",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
              stackedValue: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
              stackedValue: 0,
            },
          ],
          avgPromptsAnswered: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          avgTimePerQuestion: [
            {
              interval: "Feb 19",
              value: 0,
            },
            {
              interval: "Feb 12",
              value: 0,
            },
            {
              interval: "Feb 05",
              value: 0,
            },
            {
              interval: "Jan 29",
              value: 0,
            },
            {
              interval: "Jan 22",
              value: 0,
            },
            {
              interval: "Jan 15",
              value: 0,
            },
            {
              interval: "Jan 08",
              value: 0,
            },
          ],
          lastSession: {
            promptsAnswered: 0,
            timePerPrompt: 0,
            completed: false,
          },
        },
      };
    },
    [],
  );
  // SAMPLE DATA FOR NOW

  const updateAllAnalytics = useCallback(
    async (newDateRange: DateRangeEnum) => {
      const data = await retrieveAnalytics<IAggregatedAnalyticsAll>(
        newDateRange,
        [AnalyticsSectionEnum.OVERALL],
      );
      setMath(data.math);
      setTrivia(data.trivia);
      setReading(data.reading);
      setWriting(data.writing);
      setOverall(data.overall);
      setDashboardMenu(newDateRange);
      setMathMenu(newDateRange);
      setReadingMenu(newDateRange);
      setWritingMenu(newDateRange);
      setTriviaMenu(newDateRange);
    },
    [retrieveAnalytics],
  );

  const updateMathAnalytics = useCallback(
    async (newDateRange: DateRangeEnum) => {
      const data = await retrieveAnalytics<IAggregatedAnalyticsMath>(
        newDateRange,
        [AnalyticsSectionEnum.MATH],
      );
      setMath(data.math);
      setMathMenu(newDateRange);
    },
    [retrieveAnalytics],
  );

  const updateReadingAnalytics = useCallback(
    async (newDateRange: DateRangeEnum) => {
      const data = await retrieveAnalytics<IAggregatedAnalyticsReading>(
        newDateRange,
        [AnalyticsSectionEnum.READING],
      );
      setReading(data.reading);
      setReadingMenu(newDateRange);
    },
    [retrieveAnalytics],
  );

  const updateWritingAnalytics = useCallback(
    async (newDateRange: DateRangeEnum) => {
      const data = await retrieveAnalytics<IAggregatedAnalyticsWriting>(
        newDateRange,
        [AnalyticsSectionEnum.WRITING],
      );
      setWriting(data.writing);
      setWritingMenu(newDateRange);
    },
    [retrieveAnalytics],
  );

  const updateTriviaAnalytics = useCallback(
    async (newDateRange: DateRangeEnum) => {
      const data = await retrieveAnalytics<IAggregatedAnalyticsTrivia>(
        newDateRange,
        [AnalyticsSectionEnum.TRIVIA],
      );
      setTrivia(data.trivia);
      setTriviaMenu(newDateRange);
    },
    [retrieveAnalytics],
  );

  useEffect(() => {
    updateAllAnalytics(DateRangeEnum.RECENT);
  }, [params.groupIds, updateAllAnalytics]);

  return (
    <div className={styles.container}>
      <div className={styles.overviewReportContainer}>
        <p className={styles.title}>Patient Group Analytics</p>
      </div>
      <div className={styles.sectionContainer}>
        <GroupOverviewReport
          menuState={[dashboardMenu, updateAllAnalytics]}
          name={overall?.name ?? "Unknown"}
          active={overall?.active ?? false}
          streak={overall?.streak ?? []}
          startDate={
            overall?.startDate ? new Date(overall.startDate) : new Date()
          }
          lastSessionDate={
            overall?.lastSessionDate
              ? new Date(overall.lastSessionDate)
              : new Date()
          }
          lastSession={
            overall?.lastSession ?? {
              mathQuestionsCompleted: 0,
              wordsRead: 0,
              promptsCompleted: 0,
              triviaQuestionsCompleted: 0,
            }
          }
          sessionCompletionHistory={overall?.streakHistory ?? dataBar}
        />
      </div>
      <Divider id="math" />
      <div className={styles.sectionContainer}>
        <GroupMathScreen
          menuState={[mathMenu, updateMathAnalytics]}
          accuracyData={math?.avgAccuracy ?? dataLine}
          difficultyData={math?.avgDifficultyScore ?? dataLine}
          numQuestionData={math?.avgQuestionsCompleted ?? numberOfQuestionData}
          timeData={math?.avgTimePerQuestion ?? dataBar}
          currentAccuracy={(math?.lastSession.accuracy ?? 0).toString()}
          currentDifficulty={(
            math?.lastSession.difficultyScore ?? 0
          ).toString()}
          totalQuestions={(
            math?.lastSession.questionsCompleted ?? 0
          ).toString()}
          totalTime={(math?.lastSession.timePerQuestion ?? 0).toString()}
        />
      </div>
      <Divider id="reading" />
      <div className={styles.sectionContainer}>
        <GroupReadingScreen
          menuState={[readingMenu, updateReadingAnalytics]}
          sessionHistory={reading?.sessionCompletion ?? dataStacked}
          readingRate={reading?.avgTimePerPassage ?? dataLine}
          avgPassageData={reading?.avgPassagesRead ?? dataBar}
          timeData={reading?.avgWordsPerMin ?? dataBar}
          avgPassageTime={(reading?.lastSession.passagesRead ?? 0).toString()}
          avgTime={(reading?.lastSession.timePerPassage ?? 0).toString()}
        />
      </div>
      <Divider id="writing" />
      <div className={styles.sectionContainer}>
        <GroupWritingScreen
          menuState={[writingMenu, updateWritingAnalytics]}
          sessionHistory={writing?.sessionCompletion ?? dataStacked}
          numCompleted={writing?.avgPromptsAnswered ?? dataBar}
          avgTimeData={writing?.avgTimePerQuestion ?? dataBar}
          totalPrompts={(writing?.lastSession.promptsAnswered ?? 0).toString()}
          avgTime={(writing?.lastSession.timePerPrompt ?? 0).toString()}
          attemptStatus={writing?.lastSession.completed ?? false}
        />
      </div>
      <Divider id="trivia" />
      <div className={styles.sectionContainer}>
        <GroupTriviaScreen
          menuState={[triviaMenu, updateTriviaAnalytics]}
          accuracyData={trivia?.avgAccuracy ?? dataLine}
          numQuestionData={
            trivia?.avgQuestionsCompleted ?? numberOfQuestionData
          }
          timeData={trivia?.avgTimePerQuestion ?? dataBar}
          avgAccuracy={(trivia?.lastSession.accuracy ?? 0).toString()}
          totalQuestions={(
            trivia?.lastSession.questionsCompleted ?? 0
          ).toString()}
          avgTime={(trivia?.lastSession.timePerQuestion ?? 0).toString()}
        />
      </div>
    </div>
  );
}
