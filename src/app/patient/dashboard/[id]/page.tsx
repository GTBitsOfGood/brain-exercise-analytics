"use client";

import {
  OverallDashboard,
  MathScreen,
  ReadingScreen,
  WritingScreen,
  TriviaScreen,
} from "@src/components/Dashboard";
import { Days } from "@/common_utils/types";
import {
  dataBar,
  dataLine,
  dataStacked,
  numberOfQuestionData,
} from "@src/utils/patients";

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

export default function Page() {
  return (
    <div className={styles.container}>
      <Divider />
      <div className={styles.sectionContainer}>
        <OverallDashboard
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
          accuracyData={dataLine}
          difficultyData={dataLine}
          numQuestionData={numberOfQuestionData}
          timeData={dataBar}
          currentAccuracy="30%"
          currentDifficulty="50%"
          totalQuestions="20"
          totalTime="1min 30sec"
        />
      </div>
      <Divider id="reading" />
      <div className={styles.sectionContainer}>
        <ReadingScreen
          sessionHistory={dataStacked}
          readingRate={dataLine}
          avgPassage={dataBar}
          timeData={dataBar}
          totalPassage={"10"}
          currentTime={"30 sec"}
          completionStatus={true}
        />
      </div>
      <Divider id="writing" />
      <div className={styles.sectionContainer}>
        <WritingScreen
          sessionHistory={dataStacked}
          numCompleted={dataBar}
          avgTime={dataBar}
          totalPrompts={"10"}
          currentTime={"2 min 20 sec"}
          attemptStatus={false}
        />
      </div>
      <Divider id="trivia" />
      <div className={styles.sectionContainer}>
        <TriviaScreen
          accuracyData={dataLine}
          numQuestionData={numberOfQuestionData}
          timeData={dataBar}
          currentAccuracy="65%"
          totalQuestions="10"
          totalTime="3 min 15 sec"
        />
      </div>
    </div>
  );
}
