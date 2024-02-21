"use client";

import {
  OverallDashboard,
  MathScreen,
  ReadingScreen,
  WritingScreen,
  TriviaScreen,
} from "@src/components/Dashboard";
import { AnalyticsSectionEnum, DateRangeEnum, Days, HttpMethod, IAggregatedAnalyticsAll, IAggregatedAnalyticsMath, IAggregatedAnalyticsReading, IAggregatedAnalyticsTrivia, IAggregatedAnalyticsWriting } from "@/common_utils/types";
import {
  dataBar,
  dataLine,
  dataStacked,
  numberOfQuestionData,
} from "@src/utils/patients";

import styles from "./page.module.scss";
import { internalRequest } from "@src/utils/requests";
import { useEffect, useRef, useState } from "react";

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
  let sectionData: Partial<IAggregatedAnalyticsAll> = {};
  const [userName, setUserName] = useState<string>("");
  const [math, setMath] = useState<Partial<IAggregatedAnalyticsMath>>({});
  const [reading, setReading] = useState<Partial<IAggregatedAnalyticsReading>>({});
  const [writing, setWriting] = useState<Partial<IAggregatedAnalyticsWriting>>({});
  const [trivia, setTrivia] = useState<Partial<IAggregatedAnalyticsTrivia>>({});

  sectionData.math = math.math;
  sectionData.reading = reading.reading;
  sectionData.trivia = trivia.trivia;
  sectionData.writing = writing.writing;

  const [dashboardMenu, setDashboardMenu] = useState<DateRangeEnum>(DateRangeEnum.RECENT);
  const [mathMenu, setMathMenu] = useState<DateRangeEnum>(DateRangeEnum.RECENT);
  const [readingMenu, setReadingMenu] = useState<DateRangeEnum>(DateRangeEnum.RECENT);
  const [writingMenu, setWritingMenu] = useState<DateRangeEnum>(DateRangeEnum.RECENT);
  const [triviaMenu, setTriviaMenu] = useState<DateRangeEnum>(DateRangeEnum.RECENT);

  // Keep track of the overall dashboard update and skip double updates
  const skipEffect = useRef({ math: false, reading: false, writing: false, trivia: false });

  useEffect(() => {
    internalRequest({
      url: "/api/patient/analytics",
      method: HttpMethod.GET,
      queryParams: {
        id: params.id,
        range: DateRangeEnum.RECENT,
        sections: JSON.stringify([
          AnalyticsSectionEnum.OVERALL,
        ]),
      }
    }).then((data) => {
      const tData = data as IAggregatedAnalyticsAll;
      setMath({ math: tData.math });
      setTrivia({ trivia: tData.trivia });
      setReading({ reading: tData.reading });
      setWriting({ writing: tData.writing });
      setUserName(userName);
    });
  }, []);

  useEffect(() => {
    skipEffect.current = { math: true, reading: true, writing: true, trivia: true }
    internalRequest({
      url: "/api/patient/analytics",
      method: HttpMethod.GET,
      queryParams: {
        id: params.id,
        range: dashboardMenu,
        sections: JSON.stringify([
          AnalyticsSectionEnum.OVERALL,
        ]),
      }
    }).then((data) => {
      const tData = data as IAggregatedAnalyticsAll;
      setMath({ math: tData.math });
      setTrivia({ trivia: tData.trivia });
      setReading({ reading: tData.reading });
      setWriting({ writing: tData.writing });
      setMathMenu(dashboardMenu);
      setReadingMenu(dashboardMenu);
      setWritingMenu(dashboardMenu);
      setTriviaMenu(dashboardMenu);
    });
  }, [dashboardMenu]);

  useEffect(() => {
    if(skipEffect.current.math && mathMenu===dashboardMenu){
      skipEffect.current.math = false;
      return;
    }
    internalRequest({
      url: "/api/patient/analytics",
      method: HttpMethod.GET,
      queryParams: {
        id: params.id,
        range: mathMenu,
        sections: JSON.stringify([
          AnalyticsSectionEnum.MATH,
        ]),
      }
    }).then((data) => {
      const tData = data as IAggregatedAnalyticsAll
      setMath({ math: tData.math });
    })
  }, [mathMenu]);

  useEffect(() => {
    if (skipEffect.current.reading && readingMenu === dashboardMenu) {
      skipEffect.current.reading = false;
      return;
    }
    internalRequest({
      url: "/api/patient/analytics",
      method: HttpMethod.GET,
      queryParams: {
        id: params.id,
        range: readingMenu,
        sections: JSON.stringify([
          AnalyticsSectionEnum.READING,
        ]),
      }
    }).then((data) => {
      const tData = data as IAggregatedAnalyticsAll
      setReading({ reading: tData.reading });
    })
  }, [readingMenu]);

  useEffect(() => {
    if (skipEffect.current.writing && writingMenu === dashboardMenu) {
      skipEffect.current.writing = false;
      return;
    }
    internalRequest({
      url: "/api/patient/analytics",
      method: HttpMethod.GET,
      queryParams: {
        id: params.id,
        range: writingMenu,
        sections: JSON.stringify([
          AnalyticsSectionEnum.WRITING,
        ]),
      }
    }).then((data) => {
      const tData = data as IAggregatedAnalyticsAll
      setWriting({ writing: tData.writing });
    })
  }, [writingMenu]);

  useEffect(() => {
    if (skipEffect.current.trivia && triviaMenu === dashboardMenu) {
      skipEffect.current.trivia = false;
      return;
    }
    internalRequest({
      url: "/api/patient/analytics",
      method: HttpMethod.GET,
      queryParams: {
        id: params.id,
        range: writingMenu,
        sections: JSON.stringify([
          AnalyticsSectionEnum.TRIVIA,
        ]),
      }
    }).then((data) => {
      const tData = data as IAggregatedAnalyticsAll
      setTrivia({ trivia: tData.trivia });
    })
  }, [triviaMenu]);

  return (
    <div className={styles.container}>
      <Divider />
      <div className={styles.sectionContainer}>
        <OverallDashboard
          menuState={[dashboardMenu, setDashboardMenu]}
          streak={[
            Days.Sunday,
            Days.Monday,
            Days.Tuesday,
            Days.Thursday,
            Days.Saturday,
          ]}
          startDate={new Date("2020-12-10")}
          endDate={new Date("2023-07-23")}
          sessionCompletionHistory={dataBar}
        />
      </div>
      <Divider id="math" />
      <div className={styles.sectionContainer}>
        <MathScreen
          menuState={[mathMenu, setMathMenu]}
          accuracyData={sectionData.math?.avgAccuracy ?? dataLine}
          difficultyData={sectionData.math?.avgDifficultyScore ?? dataLine}
          numQuestionData={sectionData.math?.avgQuestionsCompleted ?? numberOfQuestionData}
          timeData={sectionData.math?.avgTimePerQuestion ?? dataBar}
          currentAccuracy="30%"
          currentDifficulty="50%"
          totalQuestions="20"
          totalTime="1min 30sec"
        />
      </div>
      <Divider id="reading" />
      <div className={styles.sectionContainer}>
        <ReadingScreen
          menuState={[readingMenu, setReadingMenu]}
          sessionHistory={sectionData.reading?.sessionCompletion ?? dataStacked}
          readingRate={sectionData.reading?.avgTimePerPassage ?? dataLine}
          avgPassage={sectionData.reading?.avgPassagesRead ?? dataBar}
          timeData={sectionData.reading?.avgWordsPerMin ?? dataBar}
          totalPassage={"10"}
          currentTime={"30 sec"}
          completionStatus={true}
        />
      </div>
      <Divider id="writing" />
      <div className={styles.sectionContainer}>
        <WritingScreen
          menuState={[writingMenu, setWritingMenu]}
          sessionHistory={sectionData.writing?.sessionCompletion ?? dataStacked}
          numCompleted={sectionData.writing?.avgPromptsAnswered ?? dataBar}
          avgTime={sectionData.writing?.avgTimePerQuestion ?? dataBar}
          totalPrompts={"10"}
          currentTime={"2 min 20 sec"}
          attemptStatus={false}
        />
      </div>
      <Divider id="trivia" />
      <div className={styles.sectionContainer}>
        <TriviaScreen
          menuState={[triviaMenu, setTriviaMenu]}
          accuracyData={sectionData.trivia?.avgAccuracy ?? dataLine}
          numQuestionData={sectionData.trivia?.avgQuestionsCompleted ?? numberOfQuestionData}
          timeData={sectionData.trivia?.avgTimePerQuestion ?? dataBar}
          currentAccuracy="65%"
          totalQuestions="10"
          totalTime="3 min 15 sec"
        />
      </div>
    </div>
  );
}
