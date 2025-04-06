"use client";

import React, { useEffect, useState, useCallback } from "react";
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
import Modal from "@src/components/Modal/Modal";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import { internalRequest } from "@src/utils/requests";

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

  const [loading, setLoading] = useState(false);

  const retrieveAnalytics = useCallback(
    async <T,>(range: DateRangeEnum, sections: AnalyticsSectionEnum[]) => {
      setLoading(true);
      console.log(params.id);
      try {
        const data = await internalRequest<T>({
          url: "/api/patient/analytics",
          method: HttpMethod.GET,
          queryParams: {
            id: params.id,
            range,
            sections: JSON.stringify(sections),
          },
        });
        setLoading(false);
        return data;
      } catch (error) {
        setLoading(false);
        return {} as IAggregatedAnalyticsAll;
      }
    },
    [params.id],
  );

  const updateAllAnalytics = useCallback(
    async (newDateRange: DateRangeEnum) => {
      const data = await retrieveAnalytics<IAggregatedAnalyticsAll>(
        newDateRange,
        [AnalyticsSectionEnum.OVERALL],
      );
      setMath(data?.math);
      setTrivia(data?.trivia);
      setReading(data?.reading);
      setWriting(data?.writing);
      setOverall(data?.overall);
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
      <title>Patient Analytics | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0" }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
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
          sessionCompletionHistory={overall?.streakHistory ?? []}
        />
      </div>
      <Divider id="math" />
      <div id="math" className={styles.sectionContainer}>
        <MathScreen
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
      <div id="reading" className={styles.sectionContainer}>
        <ReadingScreen
          menuState={[readingMenu, updateReadingAnalytics]}
          sessionHistory={reading?.sessionCompletion ?? []}
          readingRate={reading?.avgTimePerPassage ?? []}
          avgPassage={reading?.avgPassagesRead ?? []}
          timeData={reading?.avgWordsPerMin ?? []}
          totalPassage={(reading?.lastSession.passagesRead ?? 0).toString()}
          currentTime={(reading?.lastSession.timePerPassage ?? 0).toString()}
          completionStatus={reading?.lastSession.completed ?? false}
        />
      </div>
      <Divider id="writing" />
      <div id="writing" className={styles.sectionContainer}>
        <WritingScreen
          menuState={[writingMenu, updateWritingAnalytics]}
          sessionHistory={writing?.sessionCompletion ?? []}
          numCompleted={writing?.avgPromptsAnswered ?? []}
          avgTime={writing?.avgTimePerQuestion ?? []}
          totalPrompts={(writing?.lastSession.promptsAnswered ?? 0).toString()}
          currentTime={(writing?.lastSession.timePerPrompt ?? 0).toString()}
          attemptStatus={writing?.lastSession.completed ?? false}
        />
      </div>
      <Divider id="trivia" />
      <div id="trivia" className={styles.sectionContainer}>
        <TriviaScreen
          menuState={[triviaMenu, updateTriviaAnalytics]}
          accuracyData={trivia?.avgAccuracy ?? []}
          numQuestionData={trivia?.avgQuestionsCompleted ?? []}
          timeData={trivia?.avgTimePerQuestion ?? []}
          currentAccuracy={(trivia?.lastSession.accuracy ?? 0).toString()}
          totalQuestions={(
            trivia?.lastSession.questionsCompleted ?? 0
          ).toString()}
          totalTime={(trivia?.lastSession.timePerQuestion ?? 0).toString()}
        />
      </div>
    </div>
  );
}
