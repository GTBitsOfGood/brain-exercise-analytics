import React from "react";
import {
  RootXIcon,
  AccuracyIcon,
  BarChartIcon,
  QuestionIcon,
  TimeIcon,
} from "@src/app/icons";
import { LineChart, BarChart, SmallDataBox } from "@src/components/Graphs";
import { DateRangeEnum } from "@/common_utils/types";
import styles from "./GroupMathScreen.module.css";
import DateSelector from "../../DateSelector/DateSelector";

interface InputProp {
  id?: string;
  accuracyData: { interval: string; value: number }[];
  difficultyData: { interval: string; value: number }[];
  numQuestionData: { interval: string; value: number }[];
  timeData: { interval: string; value: number }[];
  currentAccuracy: string;
  currentDifficulty: string;
  totalQuestions: string;
  totalTime: string;
  style?: object;
  menuState: [
    selectedValue: DateRangeEnum,
    setSelectedvalue: (value: DateRangeEnum) => void,
  ];
}

const GroupMathScreen = ({
  accuracyData,
  difficultyData,
  numQuestionData,
  timeData,
  currentAccuracy,
  currentDifficulty,
  totalQuestions,
  totalTime,
  style,
  menuState,
}: InputProp) => {
  const modifiedAccuracy = `${Math.round(+currentAccuracy * 100)}%`;
  const modifiedTime = `${Math.round(+totalTime)} seconds`;
  const modifiedQuestionsCompleted = `${Math.round(+totalQuestions)}`;
  const modifiedDifficulty = `${Math.round(+currentDifficulty)}`;

  return (
    <div className={styles.container} style={style}>
      <div className={styles.header}>
        <RootXIcon />
        <p>Math</p>
        <div className={styles.dateSelector}>
          <DateSelector
            selectedValue={menuState[0]}
            setSelectedValue={menuState[1]}
          />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.graphs}>
          <LineChart
            width={325}
            height={175}
            title="Average Math Accuracy"
            hoverable={true}
            percentageChange={true}
            info="Number correct on first attempt divided by total"
            data={accuracyData}
            fullWidth
            gridLines
          />
          <LineChart
            width={325}
            height={175}
            title="Average Math Difficulty"
            hoverable={true}
            percentageChange={true}
            info=""
            data={difficultyData}
            fullWidth
            gridLines
          />
          <BarChart
            width={325}
            height={175}
            title="Average Questions Answered per Session"
            data={numQuestionData}
            hoverable
            percentageChange
            highlightLargest={false}
            fullWidth
            gridLines
          />
          <BarChart
            width={325}
            height={175}
            title="Average Time Spent per Question"
            info="In seconds"
            data={timeData}
            hoverable
            percentageChange
            highlightLargest={false}
            fullWidth
            gridLines
          />
        </div>
        <div className={styles.textStats}>
          <p className={styles.sessionHeading}>Average Session Breakdown</p>
          <SmallDataBox
            className={styles.box}
            title="Average Accuracy"
            text={modifiedAccuracy}
            Icon={AccuracyIcon}
          />
          <SmallDataBox
            className={styles.box}
            title="Average Difficulty"
            text={modifiedDifficulty}
            Icon={BarChartIcon}
          />
          <SmallDataBox
            className={styles.box}
            title="Average Number of Question Completed"
            text={modifiedQuestionsCompleted}
            Icon={QuestionIcon}
          />
          <SmallDataBox
            className={styles.box}
            title="Average Time per Question"
            text={modifiedTime}
            Icon={TimeIcon}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupMathScreen;
