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
            info="Some really extremely interesting information about stacked bar chart."
            hoverable
            percentageChange
          />
          <BarChart
            title="Average Number of Prompts Completed"
            data={numCompleted}
            hoverable
            percentageChange
            style={{ width: "100%", height: "100%" }}
            info="Some info for testing purposes in bar chart"
          />
          <BarChart
            title="Average Time Spent Per Prompt"
            data={avgTime}
            info="Some info for testing purposes in bar chart"
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