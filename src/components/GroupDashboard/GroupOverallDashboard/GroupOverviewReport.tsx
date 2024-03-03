import {
  DashboardIcon as DB,
  SqrtIcon,
  BookIcon,
  DocIcon,
  QuestionIcon,
  PersonIcon,
  PeopleIcon,
} from "@src/app/icons";
import { CSSProperties, ReactNode } from "react";
import { DateRangeEnum, Days } from "@/common_utils/types";
import { D3Data } from "@src/utils/types";
import DateSelector from "@src/components/DateSelector/DateSelector";
import GroupSelector from "@src/components/GroupSelector/GroupSelector";
import { BarChart, SmallDataBox } from "../../Graphs";
import styles from "./GroupOverviewReport.module.scss";

interface Params {
  active: boolean;
  name: string;
  streak: Days[];
  startDate: Date;
  lastSessionDate: Date;
  lastSession: {
    mathQuestionsCompleted: number;
    wordsRead: number;
    promptsCompleted: number;
    triviaQuestionsCompleted: number;
  };
  sessionCompletionHistory: D3Data["data"];
  style?: CSSProperties;
  menuState: [
    selectedValue: DateRangeEnum,
    setSelectedvalue: (value: DateRangeEnum) => void,
  ];

  // Need to update with the schema of the response we will get from the backend
}

function Chip(props: {
  color: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={styles.Chip}
      style={{
        backgroundColor: props.color,
        ...props.style,
      }}
    >
      <p className={styles.text}>{props.children}</p>
    </div>
  );
}

export default function GroupOverviewReport(params: Params) {
  return (
    <div className={styles.OverallDashboard} style={params.style}>
      <div className={styles.titleRow}>
        <DB />
        <p
          className={styles.title}
          style={{ marginLeft: "20px", color: "#2b3674" }}
        >
          Overview
        </p>
        <p style={{ marginLeft: "10px" }}>
          <GroupSelector
            selectedValue={params.menuState[0]}
            setSelectedValue={params.menuState[1]}
          />
        </p>
        <div className={styles.dateSelector}>
          <DateSelector
            selectedValue={params.menuState[0]}
            setSelectedValue={params.menuState[1]}
          />
        </div>
      </div>
      <div className={styles.dataGrid}>
        <SmallDataBox
          className={styles.box}
          title="Total Users"
          Icon={PeopleIcon}
          text="200"
        />
        <SmallDataBox
          className={styles.box}
          title="Active Users"
          Icon={PersonIcon}
          text={"10"}
        />
      </div>
      <div className={styles.middleContainer}>
        <BarChart
          className={styles.graph}
          width={300}
          height={200}
          title="Average Session Completion History"
          data={params.sessionCompletionHistory}
          highlightLargest
          gridLines
        />
        <BarChart
          className={styles.graph}
          width={300}
          height={200}
          title="Average Time Spent in App"
          data={params.sessionCompletionHistory}
          highlightLargest
          gridLines
        />
      </div>
      <div className={styles.bottomContainer}>
        <SmallDataBox
          className={styles.box}
          title="Average Questions Completed"
          text={"10"}
          Icon={SqrtIcon}
          Chip={() => <Chip color="#32D29633">Math</Chip>}
        />
        <SmallDataBox
          className={styles.box}
          title="Average Words Read"
          text={"10"}
          Icon={BookIcon}
          Chip={() => <Chip color="#32D29633">Reading</Chip>}
        />
        <SmallDataBox
          className={styles.box}
          title="Average Prompts Completed"
          text={"5"}
          Icon={DocIcon}
          Chip={() => <Chip color="#32D29633">Reading</Chip>}
        />
        <SmallDataBox
          className={styles.box}
          title="Average Questions Completed"
          text={"5"}
          Icon={QuestionIcon}
        />
      </div>
    </div>
  );
}
