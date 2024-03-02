"use client";

import {
  OverallDashboard,
  MathScreen,
  ReadingScreen,
  WritingScreen,
  TriviaScreen,
} from "@src/components/Dashboard";
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
} from "@/common_utils/types";
import {
  dataBar,
  dataLine,
  dataStacked,
  numberOfQuestionData,
} from "@src/utils/patients";

import { internalRequest } from "@src/utils/requests";
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

export default function Page({ params }: { params: { id: string } }) {
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

  const retrieveAnalytics = useCallback(
    async <T,>(range: DateRangeEnum, sections: AnalyticsSectionEnum[]) => {
      const data = await internalRequest<T>({
        url: "/api/patient/analytics",
        method: HttpMethod.GET,
        queryParams: {
          id: params.id,
          range,
          sections: JSON.stringify(sections),
        },
      });
      return data;
    },
    [params.id],
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
  }, [params.id, updateAllAnalytics]);

  return (
    <div className={styles.container}>
      <Divider />
      <div className={styles.sectionContainer}>
        <OverallDashboard
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
        <MathScreen
          menuState={[mathMenu, updateMathAnalytics]}
          accuracyData={math?.avgAccuracy ?? dataLine}
          difficultyData={math?.avgDifficultyScore ?? dataLine}
          numQuestionData={math?.avgQuestionsCompleted ?? numberOfQuestionData}
          timeData={math?.avgTimePerQuestion ?? dataBar}
          currentAccuracy="30%"
          currentDifficulty="50%"
          totalQuestions="20"
          totalTime="1 min 30 sec"
        />
      </div>
      <Divider id="reading" />
      <div className={styles.sectionContainer}>
        <ReadingScreen
          menuState={[readingMenu, updateReadingAnalytics]}
          sessionHistory={reading?.sessionCompletion ?? dataStacked}
          readingRate={reading?.avgTimePerPassage ?? dataLine}
          avgPassage={reading?.avgPassagesRead ?? dataBar}
          timeData={reading?.avgWordsPerMin ?? dataBar}
          totalPassage={"10"}
          currentTime={"30 sec"}
          completionStatus={true}
        />
      </div>
      <Divider id="writing" />
      <div className={styles.sectionContainer}>
        <WritingScreen
          menuState={[writingMenu, updateWritingAnalytics]}
          sessionHistory={writing?.sessionCompletion ?? dataStacked}
          numCompleted={writing?.avgPromptsAnswered ?? dataBar}
          avgTime={writing?.avgTimePerQuestion ?? dataBar}
          totalPrompts={"10"}
          currentTime={"2 min 20 sec"}
          attemptStatus={false}
        />
      </div>
      <Divider id="trivia" />
      <div className={styles.sectionContainer}>
        <TriviaScreen
          menuState={[triviaMenu, updateTriviaAnalytics]}
          accuracyData={trivia?.avgAccuracy ?? dataLine}
          numQuestionData={
            trivia?.avgQuestionsCompleted ?? numberOfQuestionData
          }
          timeData={trivia?.avgTimePerQuestion ?? dataBar}
          currentAccuracy="65%"
          totalQuestions="10"
          totalTime="3 min 15 sec"
        />
      </div>
    </div>
  );
}
