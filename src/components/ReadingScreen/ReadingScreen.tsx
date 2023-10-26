import React from "react";
import { WritingIcon } from "@src/app/icons/writingIcon";
import styles from "./ReadingScreen.module.css";
import DateSelector from "../DateSelector/DateSelector";
import StackedBarChart from "../StackedBarChart";
import BarChart from "../BarChart";
import SmallDataBox from "../SmallDataBox";
import { PromptsIcon } from "@src/app/icons/promptsIcon";
import { timeIcon } from "@src/app/icons/timeIcon";
import BooleanBox from "../BooleanBox/BooleanBox";
import { attemptIcon } from "@src/app/icons/attemptIcon";

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

const ReadingIcon = () => {
  return (
    <>
      <svg
        width="43"
        height="43"
        viewBox="0 0 43 43"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M38.4375 7.53125H29.0531C27.0393 7.53125 25.0705 8.10957 23.3766 9.20059L21.375 10.4844L19.3734 9.20059C17.6812 8.10978 15.7102 7.53017 13.6969 7.53125H4.3125C3.58652 7.53125 3 8.11777 3 8.84375V32.1406C3 32.8666 3.58652 33.4531 4.3125 33.4531H13.6969C15.7107 33.4531 17.6795 34.0314 19.3734 35.1225L21.1945 36.2955C21.2479 36.3283 21.3094 36.3488 21.3709 36.3488C21.4324 36.3488 21.4939 36.3324 21.5473 36.2955L23.3684 35.1225C25.0664 34.0314 27.0393 33.4531 29.0531 33.4531H38.4375C39.1635 33.4531 39.75 32.8666 39.75 32.1406V8.84375C39.75 8.11777 39.1635 7.53125 38.4375 7.53125ZM13.6969 30.5H5.95312V10.4844H13.6969C15.1488 10.4844 16.5598 10.8986 17.7779 11.682L19.7795 12.9658L20.0625 13.1504V32.0996C18.1102 31.0496 15.9281 30.5 13.6969 30.5ZM36.7969 30.5H29.0531C26.8219 30.5 24.6398 31.0496 22.6875 32.0996V13.1504L22.9705 12.9658L24.9721 11.682C26.1902 10.8986 27.6012 10.4844 29.0531 10.4844H36.7969V30.5ZM16.6541 15.7344H9.0334C8.87344 15.7344 8.74219 15.8738 8.74219 16.042V17.8877C8.74219 18.0559 8.87344 18.1953 9.0334 18.1953H16.65C16.81 18.1953 16.9412 18.0559 16.9412 17.8877V16.042C16.9453 15.8738 16.8141 15.7344 16.6541 15.7344ZM25.8047 16.042V17.8877C25.8047 18.0559 25.9359 18.1953 26.0959 18.1953H33.7125C33.8725 18.1953 34.0037 18.0559 34.0037 17.8877V16.042C34.0037 15.8738 33.8725 15.7344 33.7125 15.7344H26.0959C25.9359 15.7344 25.8047 15.8738 25.8047 16.042ZM16.6541 21.4766H9.0334C8.87344 21.4766 8.74219 21.616 8.74219 21.7842V23.6299C8.74219 23.798 8.87344 23.9375 9.0334 23.9375H16.65C16.81 23.9375 16.9412 23.798 16.9412 23.6299V21.7842C16.9453 21.616 16.8141 21.4766 16.6541 21.4766ZM33.7166 21.4766H26.0959C25.9359 21.4766 25.8047 21.616 25.8047 21.7842V23.6299C25.8047 23.798 25.9359 23.9375 26.0959 23.9375H33.7125C33.8725 23.9375 34.0037 23.798 34.0037 23.6299V21.7842C34.0078 21.616 33.8766 21.4766 33.7166 21.4766Z"
          fill="#A3AED0"
        />
      </svg>
    </>
  );
};

export const ReadingScreen = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <ReadingIcon />
        <p>READING</p>
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
