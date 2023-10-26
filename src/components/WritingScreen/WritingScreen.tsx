import React from "react";
import { PromptsIcon } from "@src/app/icons/promptsIcon";
import { timeIcon } from "@src/app/icons/timeIcon";
import { attemptIcon } from "@src/app/icons/attemptIcon";
import StackedBarChart from "@src/components/StackedBarChart";
import SmallDataBox from "@src/components/SmallDataBox";
import BarChart from "@src/components/BarChart";
import { WritingIcon } from "@src/app/icons/writingIcon";
import DateSelector from "@src/components/DateSelector/DateSelector";
import BooleanBox from "../BooleanBox/BooleanBox";
import styles from "./WritingScreen.module.css";

const dataStacked = [
  {
    interval: "9/17",
    stackedValue: 0.3,
    value: 0.5,
  },
  {
    interval: "9/24",
    stackedValue: 0.1,
    value: 0.2,
  },
  {
    interval: "10/4",
    stackedValue: 0.1,
    value: 0.7,
  },
  {
    interval: "10/12",
    stackedValue: 0.55,
    value: 0.6,
  },
  {
    interval: "10/19",
    stackedValue: 0.2,
    value: 0.5,
  },
  {
    interval: "10/25",
    stackedValue: 0.0,
    value: 0.8,
  },
];
const dataBar = [
  {
    interval: "9/17",
    value: 0,
  },
  {
    interval: "9/24",
    value: 2,
  },
  {
    interval: "10/4",
    value: 1,
  },
  {
    interval: "10/12",
    value: 6,
  },
  {
    interval: "10/19",
    value: 5,
  },
  {
    interval: "10/25",
    value: 7,
  },
];

interface InputProp {
  sessionHistory: {
    interval: string;
    value: number;
    stackedValue: number;
  }[];
  numCompleted: { interval: string; value: number }[];
  avgTime: { interval: string; value: number }[];
  totalPrompts: string;
  currentTime: string;
  attemptStatus: boolean;
  style?: object;
}

export const WritingScreen = ({
  sessionHistory,
  numCompleted,
  avgTime,
  totalPrompts,
  currentTime,
  attemptStatus,
  style,
}: InputProp) => {
  return (
    <div className={styles.container} style={style}>
      <div className={styles.header}>
        <WritingIcon />
        <p>WRITING</p>
        <div className={styles.dateSelector}>
          <DateSelector />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.graphs}>
          <StackedBarChart
            title="Writing Session Completion History"
            data={sessionHistory}
            legend={{
              valueText: "sessions completed without writing",
              stackedValueText: "sessions completed with writing",
            }}
            hoverable
            percentageChange
          />
          <BarChart
            title="Average Number of Prompts Completed"
            data={numCompleted}
            hoverable
            percentageChange
            style={{ width: "100%", height: "100%" }}
          />
          <BarChart
            title="Average Time Spent Per Prompt"
            data={avgTime}
            hoverable
            percentageChange
            style={{ width: "100%", height: "100%" }}
          />
        </div>
        <div className={styles.textStats}>
          <p className={styles.sessionHeading}>Last Session Breakdown</p>
          <SmallDataBox
            title="Number of Prompts Completed"
            text={totalPrompts}
            Icon={PromptsIcon}
            style={{ width: "80%", margin: "auto" }}
          />
          <SmallDataBox
            title="Current Time per Prompt"
            text={currentTime}
            Icon={timeIcon}
            style={{ width: "80%", margin: "auto" }}
          />
          <BooleanBox
            title="Completion Status"
            greenText="ATTEMPTED"
            redText="NOT ATTEMPTED"
            Icon={attemptIcon}
            showGreen={attemptStatus}
            style={{ width: "80%", margin: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};
