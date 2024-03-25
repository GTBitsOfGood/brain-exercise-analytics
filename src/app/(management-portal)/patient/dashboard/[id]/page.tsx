"use client";

import React, { useEffect, useRef } from "react";
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
  const mathRef = useRef<HTMLDivElement>(null);
  const readingRef = useRef<HTMLDivElement>(null);
  const writingRef = useRef<HTMLDivElement>(null);
  const triviaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    };

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute("id");
          if (id) {
            document.location.replace(`#${id}`);
          }
        }
      });
    };

    const observerMath = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    if (mathRef.current) observerMath.observe(mathRef.current);

    const observerReading = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    if (readingRef.current) observerReading.observe(readingRef.current);

    const observerWriting = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    if (writingRef.current) observerWriting.observe(writingRef.current);

    const observerTrivia = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    if (triviaRef.current) observerTrivia.observe(triviaRef.current);

    return () => {
      observerMath.disconnect();
      observerReading.disconnect();
      observerWriting.disconnect();
      observerTrivia.disconnect();
    };
  }, []);

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
      <div ref={mathRef} id="math" className={styles.sectionContainer}>
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
      <div ref={readingRef} id="reading" className={styles.sectionContainer}>
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
      <div ref={writingRef} id="writing" className={styles.sectionContainer}>
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
      <div ref={triviaRef} id="trivia" className={styles.sectionContainer}>
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
