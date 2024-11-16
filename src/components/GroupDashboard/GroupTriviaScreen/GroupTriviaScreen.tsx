import React from "react";
import { AccuracyIcon, QuestionIcon, TimeIcon } from "@src/app/icons";
import { DateRangeEnum } from "@/common_utils/types";
import DateSelector from "../../DateSelector/DateSelector";
import { SmallDataBox, LineChart, BarChart } from "../../Graphs";
import styles from "./GroupTriviaScreen.module.css";

const TriviaIcon = () => {
  return (
    <>
      <svg
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M21.75 39.875C11.7396 39.875 3.625 31.7604 3.625 21.75C3.625 11.7396 11.7396 3.625 21.75 3.625C31.7604 3.625 39.875 11.7396 39.875 21.75C39.875 31.7604 31.7604 39.875 21.75 39.875ZM21.75 36.25C25.5956 36.25 29.2838 34.7223 32.003 32.003C34.7223 29.2838 36.25 25.5956 36.25 21.75C36.25 17.9044 34.7223 14.2162 32.003 11.497C29.2838 8.77767 25.5956 7.25 21.75 7.25C17.9044 7.25 14.2162 8.77767 11.497 11.497C8.77767 14.2162 7.25 17.9044 7.25 21.75C7.25 25.5956 8.77767 29.2838 11.497 32.003C14.2162 34.7223 17.9044 36.25 21.75 36.25ZM19.9375 27.1875H23.5625V30.8125H19.9375V27.1875ZM23.5625 24.2059V25.375H19.9375V22.6562C19.9375 22.1755 20.1285 21.7145 20.4684 21.3746C20.8083 21.0347 21.2693 20.8438 21.75 20.8438C22.2649 20.8437 22.7692 20.6975 23.2042 20.422C23.6392 20.1466 23.9871 19.7533 24.2073 19.2879C24.4276 18.8225 24.5111 18.3041 24.4482 17.793C24.3854 17.282 24.1787 16.7993 23.8522 16.4012C23.5257 16.003 23.0929 15.7057 22.6041 15.5439C22.1153 15.3822 21.5906 15.3625 21.091 15.4873C20.5915 15.612 20.1376 15.8761 19.7823 16.2487C19.427 16.6214 19.1847 17.0872 19.0838 17.5921L15.5277 16.8798C15.7481 15.778 16.2572 14.7544 17.0029 13.9138C17.7486 13.0732 18.7041 12.4457 19.7718 12.0954C20.8395 11.7451 21.9811 11.6846 23.0798 11.9201C24.1785 12.1556 25.195 12.6786 26.0254 13.4357C26.8557 14.1928 27.4701 15.1569 27.8058 16.2292C28.1414 17.3016 28.1863 18.4439 27.9358 19.5393C27.6853 20.6347 27.1484 21.644 26.3801 22.4639C25.6117 23.2838 24.6394 23.885 23.5625 24.2059Z"
          fill="#A3AED0"
        />
      </svg>
    </>
  );
};

interface InputProp {
  accuracyData: { interval: string; value: number }[];
  numQuestionData: { interval: string; value: number }[];
  timeData: { interval: string; value: number }[];
  avgAccuracy: string;
  totalQuestions: string;
  avgTime: string;
  style?: object;
  menuState: [
    selectedValue: DateRangeEnum,
    setSelectedvalue: (value: DateRangeEnum) => void,
  ];
}

export default function GroupTriviaScreen({
  accuracyData,
  numQuestionData,
  timeData,
  avgAccuracy,
  totalQuestions,
  avgTime,
  style,
  menuState,
}: InputProp) {
  const modifiedAccuracy = `${Math.round(+avgAccuracy * 100)}%`;
  const modifiedTime = `${Math.round(+avgTime)} seconds`;
  const modifiedQuestionsCompleted = `${Math.round(+totalQuestions)}`;

  return (
    <div className={styles.container} style={style}>
      <div className={styles.header}>
        <TriviaIcon />
        <p>Trivia</p>
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
            title="Average Trivia Accuracy"
            hoverable={true}
            percentageChange={true}
            info="Number of self-reported correct answers"
            data={accuracyData}
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
            fullWidth
            gridLines
          />
        </div>
        <div className={styles.textStats}>
          <p className={styles.sessionHeading}>Last Session Breakdown</p>
          <SmallDataBox
            className={styles.box}
            title="Average Accuracy"
            text={modifiedAccuracy}
            Icon={AccuracyIcon}
            // style={{ width: "80%", margin: "auto" }}
          />
          <SmallDataBox
            className={styles.box}
            title="Average Number of Question Completed"
            text={modifiedQuestionsCompleted}
            Icon={QuestionIcon}
            // style={{ width: "80%", margin: "auto" }}
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
}
