import {
  DashboardIcon as DB,
  ImportantGrayIcon as IGI,
  CheckCircle as CC,
  TimeForward as TF,
  LastPage as PF,
  CompletedIcon as COI,
  SqrtIcon as SQ,
  BookIcon as BI,
  DocIcon as DI,
  QuestionIcon as QI,
} from "@src/app/icons";
import { CSSProperties, ReactNode } from "react";
import { Days } from "@/common_utils/types";
import { D3Data } from "@src/utils/types";
import { BarChart, SmallDataBox, WeeklyProgress } from "../../Graphs";
import styles from "./OverallDashboard.module.scss";

interface Params {
  streak: Days[];
  startDate: Date;
  endDate: Date;
  sessionCompletionHistory: D3Data["data"];
  style?: CSSProperties;

  // Need to update with the schema of the response we will get from the backend
}

// For the name of the user it would be really useful to have a reducer store this information globally during authentication (like in the mobile app)
const currentUser = "John Doe";

const options: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "short",
};

function formatDate(date: Date) {
  const str = date.toLocaleDateString("en-us", options);
  const arr = str.split(" ");
  return [arr[2], arr[0], arr[1]].join(" ");
}

function ActiveIndicatorBox({
  active = true,
  style = {},
}: {
  active?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={styles.ActiveIndicatorBox} style={style}>
      <div className={styles.container}>
        <CC />
        <p className={styles.text}>{active ? "Active" : "Inactive"}</p>
      </div>
    </div>
  );
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

export default function OverallDashboard(params: Params) {
  return (
    <div className={styles.OverallDashboard} style={params.style}>
      <div className={styles.titleRow}>
        <DB />
        <p
          className={styles.title}
          style={{ marginLeft: "20px", color: "#2b3674" }}
        >
          Overall Dashboard
        </p>
        <p
          className={styles.title}
          style={{ color: "#a3aed0", marginLeft: "62px" }}
        >
          {currentUser}
        </p>
        <ActiveIndicatorBox
          active
          style={{ marginLeft: "17px", marginRight: "10px" }}
        />
        <IGI />
        {/* <Dropdown style={{ marginLeft: "auto" }} /> */}
      </div>
      <WeeklyProgress days={params.streak} />
      <div className={styles.bottomContainer}>
        <div className={styles.dateBoxes}>
          <SmallDataBox
            className={styles.box}
            title="Start Date"
            text={formatDate(params.startDate)}
            Icon={TF}
            titleAboveText
            style={{ width: "282px", height: "98px" }}
          />
          <SmallDataBox
            className={styles.box}
            title="End Date"
            text={formatDate(params.endDate)}
            Icon={PF}
            titleAboveText
            style={{ width: "282px", height: "98px" }}
          />
          <SmallDataBox
            className={styles.box}
            title="Total Completed Sessions"
            text={formatDate(params.startDate)}
            Icon={COI}
            titleAboveText
            style={{ width: "282px", height: "98px" }}
          />
        </div>

        <BarChart
          width={370}
          height={250}
          style={{ width: "447px", paddingLeft: "30px", height: "324px" }}
          title="Session Completion History"
          data={params.sessionCompletionHistory}
          highlightLargest
        />

        <div className={styles.lastSession}>
          <p className={styles.title}>Last Session</p>
          <div className={styles.boxes}>
            <SmallDataBox
              className={styles.box}
              title="Questions Completed"
              text={"Need data"}
              Icon={SQ}
              titleAboveText
              style={{ width: "282px", height: "98px" }}
              Chip={() => <Chip color="#FF9FB34D">Math</Chip>}
            />
            <SmallDataBox
              className={styles.box}
              title="Prompts Completed"
              text={"Need data"}
              Icon={DI}
              titleAboveText
              Chip={() => <Chip color="#32D29633">Writing</Chip>}
              style={{ width: "282px", height: "98px" }}
            />
            <SmallDataBox
              className={styles.box}
              title="Words Read Per Min"
              text={"Need data"}
              Icon={BI}
              titleAboveText
              style={{ width: "282px", height: "98px" }}
              Chip={() => <Chip color="#008AFC1A">Reading</Chip>}
            />
            <SmallDataBox
              className={styles.box}
              title="Questions Completed"
              text={"Need data"}
              Icon={QI}
              titleAboveText
              style={{ width: "282px", height: "98px" }}
              Chip={() => <Chip color="#FBBC054D">Trivia</Chip>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
