import React from "react";
import { RootXIcon } from "@src/app/icons/root_x";
import { accuracyIcon } from "@src/app/icons/accuracyIcon";
import { barChartIcon } from "@src/app/icons/barChartIcon";
import { questionIcon } from "@src/app/icons/questionIcon";
import { timeIcon } from "@src/app/icons/timeIcon";
import LineChart from "../LineChart";
import BarChart from "../BarChart";
import SmallDataBox from "../SmallDataBox";
import styles from "./MathScreen.module.css";
import DateSelector from "../DateSelector/DateSelector";

interface InputProp {
  accuracyData: { interval: string; value: number }[];
  difficultyData: { interval: string; value: number }[];
  numQuestionData: { interval: string; value: number }[];
  timeData: { interval: string; value: number }[];
  currentAccuracy: string;
  currentDifficulty: string;
  totalQuestions: string;
  totalTime: string;
  style?: object;
}

const MathScreen = ({
  accuracyData,
  difficultyData,
  numQuestionData,
  timeData,
  currentAccuracy,
  currentDifficulty,
  totalQuestions,
  totalTime,
  style,
}: InputProp) => {
  return (
    <div className={styles.container} style={style}>
      <div className={styles.header}>
        <RootXIcon />
        <p>MATH</p>
        <div className={styles.dateSelector}>
          <DateSelector />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.graphs}>
          <LineChart
            title="Average Math Accuracy"
            hoverable={true}
            percentageChange={true}
            gradient={true}
            info="Vidushi"
            data={accuracyData}
            style={{ width: "100%", height: "100%" }}
          />
          <LineChart
            title="Average Math Difficulty"
            hoverable={true}
            percentageChange={true}
            gradient={true}
            info="Vidushi"
            data={difficultyData}
            style={{ width: "100%", height: "100%" }}
          />
          <BarChart
            title="Average Number of Questions Answered per Session"
            data={numQuestionData}
            hoverable
            percentageChange
            style={{ width: "100%", height: "100%" }}
          />
          <BarChart
            title="Average Time Spent per Question"
            data={timeData}
            hoverable
            percentageChange
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className={styles.textStats}>
          <p className={styles.sessionHeading}>Last Session Breakdown</p>
          <SmallDataBox
            title="Current Accuracy"
            text={currentAccuracy}
            Icon={accuracyIcon}
            style={{ width: "80%", margin: "auto" }}
          />
          <SmallDataBox
            title="Current Difficulty"
            text={currentDifficulty}
            Icon={barChartIcon}
            style={{ width: "80%", margin: "auto" }}
          />
          <SmallDataBox
            title="Number of Question Completed"
            text={totalQuestions}
            Icon={questionIcon}
            style={{ width: "80%", margin: "auto" }}
          />
          <SmallDataBox
            title="Current Time per Question"
            text={totalTime}
            Icon={timeIcon}
            style={{ width: "80%", margin: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};

export default MathScreen;
