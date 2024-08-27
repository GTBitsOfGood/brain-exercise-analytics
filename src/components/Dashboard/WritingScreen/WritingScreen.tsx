import React from "react";
import {
  PromptsIcon,
  TimeIcon,
  AttemptIcon,
  WritingIcon,
} from "@src/app/icons";
import DateSelector from "@src/components/DateSelector/DateSelector";
import { DateRangeEnum } from "@/common_utils/types";
import {
  StackedBarChart,
  SmallDataBox,
  BarChart,
  BooleanBox,
} from "../../Graphs";
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
  menuState: [
    selectedValue: DateRangeEnum,
    setSelectedvalue: (value: DateRangeEnum) => void,
  ];
}

export default function WritingScreen({
  sessionHistory,
  numCompleted,
  avgTime,
  totalPrompts,
  currentTime,
  attemptStatus,
  style,
  menuState,
}: InputProp) {
  return (
    <div className={styles.container} style={style}>
      <div className={styles.header}>
        <WritingIcon />
        <p>Writing</p>
        <div className={styles.dateSelector}>
          <DateSelector
            selectedValue={menuState[0]}
            setSelectedValue={menuState[1]}
          />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.graphs}>
          <StackedBarChart
            width={325}
            height={210}
            title="Writing Session Completion History"
            data={sessionHistory}
            legend={[
              { text: "sessions completed without writing", color: "#FF9FB3" },
              { text: "sessions completed with writing", color: "#008AFC" },
            ]}
            info="Some really extremely interesting information about stacked bar chart."
            hoverable
            percentageChange
            fullWidth
            gridLines
          />
          <BarChart
            width={325}
            height={210}
            title="Average Prompts Completed"
            data={numCompleted}
            hoverable
            percentageChange
            fullWidth
            gridLines
            info="Some info for testing purposes in bar chart"
          />
          <BarChart
            width={325}
            height={185}
            title="Average Time Spent Per Prompt"
            data={avgTime}
            info="Some info for testing purposes in bar chart"
            hoverable
            percentageChange
            fullWidth
            gridLines
          />
        </div>
        <div className={styles.textStats}>
          <p className={styles.sessionHeading}>Last Session Breakdown</p>
          <SmallDataBox
            className={styles.box}
            title="Number of Prompts Completed"
            text={totalPrompts}
            Icon={PromptsIcon}
            // style={{ width: "80%", margin: "auto" }}
          />
          <SmallDataBox
            className={styles.box}
            title="Current Time per Prompt"
            text={currentTime}
            Icon={TimeIcon}
            // style={{ width: "80%", margin: "auto" }}
          />
          <BooleanBox
            className={styles.box}
            title="Completion Status"
            greenText="ATTEMPTED"
            redText="NOT ATTEMPTED"
            Icon={AttemptIcon}
            showGreen={attemptStatus}
            // style={{ width: "80%", margin: "auto" }}
          />
        </div>
      </div>
    </div>
  );
}
