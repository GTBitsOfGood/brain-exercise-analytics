import React from "react";
import { PromptsIcon, TimeIcon, WritingIcon } from "@src/app/icons";
import DateSelector from "@src/components/DateSelector/DateSelector";
import { DateRangeEnum } from "@/common_utils/types";
import { SmallDataBox, BarChart } from "../../Graphs";
import styles from "./GroupWritingScreen.module.css";

interface InputProp {
  sessionHistory: {
    interval: string;
    value: number;
    stackedValue: number;
  }[];
  numCompleted: { interval: string; value: number }[];
  avgTimeData: { interval: string; value: number }[];
  totalPrompts: string;
  avgTime: string;
  attemptStatus: boolean;
  style?: object;
  menuState: [
    selectedValue: DateRangeEnum,
    setSelectedvalue: (value: DateRangeEnum) => void,
  ];
}

export default function GroupWritingScreen({
  numCompleted,
  avgTimeData,
  totalPrompts,
  avgTime,
  style,
  menuState,
}: InputProp) {
  const modifiedPrompts = `${Math.round(+totalPrompts)}`;
  const modifiedTime = `${Math.round(+avgTime)} seconds`;

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
            data={avgTimeData}
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
            title="Average Number of Prompts Completed"
            text={modifiedPrompts}
            Icon={PromptsIcon}
          />
          <SmallDataBox
            className={styles.box}
            title="Average Time per Prompt"
            text={modifiedTime}
            Icon={TimeIcon}
          />
        </div>
      </div>
    </div>
  );
}
