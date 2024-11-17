import {
  DashboardIcon as DB,
  SqrtIcon,
  BookIcon,
  DocIcon,
  QuestionIcon,
  PersonIcon,
  PeopleIcon,
} from "@src/app/icons";
import { CSSProperties } from "react";
import { DateRangeEnum, Days } from "@/common_utils/types";
import { D3Data } from "@src/utils/types";
import DateSelector from "@src/components/DateSelector/DateSelector";
import GroupSelector from "@src/components/GroupSelector/GroupSelector";
import Chip from "@src/components/Chip/Chip";
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
  totalPatients: Number | String,
  activePatients: Number | String
  // Need to update with the schema of the response we will get from the backend
}

export default function GroupOverviewReport(params: Params) {

  const mathQuestionsCompleted = `${+Math.round(params.lastSession.mathQuestionsCompleted)}`
  const wordsRead = `${+Math.round(params.lastSession.wordsRead)}`
  const promptsCompleted = `${+Math.round(params.lastSession.promptsCompleted)}`
  const triviaQuestionsCompleted = `${+Math.round(params.lastSession.triviaQuestionsCompleted)}`

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
          <GroupSelector shownValue="Selected Group" />
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
          title="Total Patients"
          Icon={PeopleIcon}
          text={`${params.totalPatients}`}
        />
        <SmallDataBox
          className={styles.box}
          title="Active Patients"
          Icon={PersonIcon}
          text={`${params.activePatients}`}
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
          text={mathQuestionsCompleted}
          Icon={SqrtIcon}
          Chip={() => <Chip color="#FCDCE2">Math</Chip>}
        />
        <SmallDataBox
          className={styles.box}
          title="Average Words Read"
          text={wordsRead}
          Icon={BookIcon}
          Chip={() => <Chip color="#E8DCFC">Reading</Chip>}
        />
        <SmallDataBox
          className={styles.box}
          title="Average Prompts Completed"
          text={promptsCompleted}
          Icon={DocIcon}
          Chip={() => <Chip color="#D6F6EA">Writing</Chip>}
        />
        <SmallDataBox
          className={styles.box}
          title="Average Questions Completed"
          text={triviaQuestionsCompleted}
          Icon={QuestionIcon}
          Chip={() => <Chip color="#FCE8DC">Trivia</Chip>}
        />
      </div>
    </div>
  );
}
