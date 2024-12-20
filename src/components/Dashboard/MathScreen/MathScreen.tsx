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
import styles from "./MathScreen.module.css";
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
  menuState,
}: InputProp) => {
  const modifiedAccuracy = `${Math.round(+currentAccuracy * 100)}%`;
  const modifiedTime = `${totalTime} seconds`;

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
            yLabel=""
            // yLabel="Questions"
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
            yLabel=""
            // yLabel="Questions"
            fullWidth
            gridLines
            info=""
          />
          <BarChart
            width={325}
            height={175}
            title="Average Time Spent per Question"
            data={timeData}
            hoverable
            percentageChange
            fullWidth
            gridLines
            info="In seconds"
          />
        </div>
        <div className={styles.textStatsWithHeader}>
          <p className={styles.sessionHeading}>Last Session Breakdown</p>
          <div className={styles.textStats}>
            <SmallDataBox
              className={styles.box}
              title="Current Accuracy"
              text={modifiedAccuracy}
              Icon={AccuracyIcon}
              // style={{ width: "80%", margin: "auto" }}
            />
            <SmallDataBox
              className={styles.box}
              title="Current Difficulty"
              text={currentDifficulty}
              Icon={BarChartIcon}
              // style={{ width: "80%", margin: "auto" }}
            />
            <SmallDataBox
              className={styles.box}
              title="Number of Question Completed"
              text={totalQuestions}
              Icon={QuestionIcon}
              // style={{ width: "80%", margin: "auto" }}
            />
            <SmallDataBox
              className={styles.box}
              title="Current Time per Question"
              text={modifiedTime}
              Icon={TimeIcon}
              // style={{ width: "80%", margin: "auto" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathScreen;
