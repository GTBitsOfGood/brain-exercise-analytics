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
  HttpMethod,
  IAggregatedAnalyticsAll,
  IAggregatedAnalyticsMath,
  IAggregatedAnalyticsOverall,
  IAggregatedAnalyticsReading,
  IAggregatedAnalyticsTrivia,
  IAggregatedAnalyticsWriting,
  PatientSearchParams,
} from "@/common_utils/types";

import Modal from "@src/components/Modal/Modal";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";

import { useCallback, useEffect, useMemo, useState } from "react";
import { internalRequest } from "@src/utils/requests";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
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
  const {
    fullName,
    active,
    countries,
    states,
    cities,
    dateOfBirths,
    emails,
    additionalAffiliations,
    dateOfJoins,
    beiChapters,
    secondaryPhoneNumbers,
    secondaryNames,
  } = useSelector(
    (patientSearchState: RootState) => patientSearchState.patientSearch,
  );
  const filters: PatientSearchParams = useMemo(
    () => ({
      name: fullName,
      dateOfBirths,
      emails,
      additionalAffiliations,
      secondaryNames,
      secondaryPhones: secondaryPhoneNumbers,
      beiChapters,
      active,
      countries,
      states,
      cities,
      dateOfJoins,
    }),
    [
      active,
      additionalAffiliations,
      beiChapters,
      cities,
      countries,
      dateOfBirths,
      dateOfJoins,
      emails,
      fullName,
      secondaryNames,
      secondaryPhoneNumbers,
      states,
    ],
  );
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

  const [totalPatients, setTotalPatients] = useState<number | string>("---");
  const [activePatients, setActivePatients] = useState<number | string>("---");

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

  const [loading, setLoading] = useState(false);

  const retrieveAnalytics = useCallback(
    async <T,>(range: DateRangeEnum, sections: AnalyticsSectionEnum[]) => {
      setLoading(true);
      try {
        const res = await internalRequest({
          url: "/api/patient/analytics/group",
          method: HttpMethod.POST,
          authRequired: true,
          body: {
            filters,
            range,
            sections,
          },
        });
        setLoading(false);
        return res as T;
      } catch (e) {
        setLoading(false);
        console.debug(e);
        return {} as T;
      }
    },
    [filters],
  );

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
      setTotalPatients(data.totalPatients);
      setActivePatients(data.activePatients);
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
      <title>Patient Group Analytics | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0" }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
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
          sessionCompletionHistory={overall?.streakHistory ?? []}
          totalPatients={totalPatients}
          activePatients={activePatients}
        />
      </div>
      <Divider id="math" />
      <div className={styles.sectionContainer}>
        <GroupMathScreen
          menuState={[mathMenu, updateMathAnalytics]}
          accuracyData={math?.avgAccuracy ?? []}
          difficultyData={math?.avgDifficultyScore ?? []}
          numQuestionData={math?.avgQuestionsCompleted ?? []}
          timeData={math?.avgTimePerQuestion ?? []}
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
          sessionHistory={reading?.sessionCompletion ?? []}
          readingRate={reading?.avgTimePerPassage ?? []}
          avgPassageData={reading?.avgPassagesRead ?? []}
          timeData={reading?.avgWordsPerMin ?? []}
          avgPassageTime={(reading?.lastSession.passagesRead ?? 0).toString()}
          avgTime={(reading?.lastSession.timePerPassage ?? 0).toString()}
        />
      </div>
      <Divider id="writing" />
      <div className={styles.sectionContainer}>
        <GroupWritingScreen
          menuState={[writingMenu, updateWritingAnalytics]}
          sessionHistory={writing?.sessionCompletion ?? []}
          numCompleted={writing?.avgPromptsAnswered ?? []}
          avgTimeData={writing?.avgTimePerQuestion ?? []}
          totalPrompts={(writing?.lastSession.promptsAnswered ?? 0).toString()}
          avgTime={(writing?.lastSession.timePerPrompt ?? 0).toString()}
          attemptStatus={writing?.lastSession.completed ?? false}
        />
      </div>
      <Divider id="trivia" />
      <div className={styles.sectionContainer}>
        <GroupTriviaScreen
          menuState={[triviaMenu, updateTriviaAnalytics]}
          accuracyData={trivia?.avgAccuracy ?? []}
          numQuestionData={trivia?.avgQuestionsCompleted ?? []}
          timeData={trivia?.avgTimePerQuestion ?? []}
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
