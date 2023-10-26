import React from "react";
import { PromptsIcon } from "@src/app/icons/promptsIcon";
import { timeIcon } from "@src/app/icons/timeIcon";
import { attemptIcon } from "@src/app/icons/attemptIcon";
import StackedBarChart from "@src/components/StackedBarChart";
import SmallDataBox from "@src/components/SmallDataBox";
import BooleanBox from "../BooleanBox/BooleanBox";
import BarChart from "@src/components/BarChart";
import styles from "./WritingScreen.module.css";
import { WritingIcon } from "@src/app/icons/writingIcon";
import DateSelector from "@src/components/DateSelector/DateSelector";

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

export const WritingScreen = () => {
  return (
    <div className={styles.container}>
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
            data={dataStacked}
            legend={{
              valueText: "valueText",
              stackedValueText: "stackedValueText",
            }}
            hoverable
            percentageChange
          />
          <BarChart
            title="Average Number of Prompts Completed"
            data={dataBar}
            hoverable
            percentageChange
            style={{ width: "100%", height: "100%" }}
          />
          <StackedBarChart
            title="Average Time Spent Per Prompt"
            data={dataStacked}
            legend={{
              valueText: "valueText",
              stackedValueText: "stackedValueText",
            }}
            hoverable
            percentageChange
          />
        </div>
        <div className={styles.textStats}>
          <p className={styles.sessionHeading}>Last Session Breakdown</p>
          <SmallDataBox
            title="Number of Prompts Completed"
            text={"hello"}
            Icon={PromptsIcon}
            style={{ width: "80%", margin: "auto" }}
          />
          <SmallDataBox
            title="Current Time per Prompt"
            text={"1 min 30 sec"}
            Icon={timeIcon}
            style={{ width: "80%", margin: "auto" }}
          />
          <BooleanBox
            title="Completion Status"
            greenText="ATTEMPTED"
            redText="NOT ATTEMPTED"
            Icon={attemptIcon}
            showGreen={true}
            style={{ width: "80%", margin: "auto" }}
          />
        </div>
      </div>
    </div>
  );
};
