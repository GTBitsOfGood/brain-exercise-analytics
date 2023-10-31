import { Stack, Grid } from "@mui/material";
import {
  dashboardIcon as DB,
  importantGrayIcon as IGI,
  checkCircle as CC,
  timeForward as TF,
  lastPage as PF,
  completedIcon as COI,
  sqrtIcon as SQ,
  bookIcon as BI,
  docIcon as DI,
  questionIcon as QI,
} from "@src/app/icons";
import { CSSProperties, ReactNode } from "react";
import { Days } from "@/common_utils/types";
import { BarChart, SmallDataBox, WeeklyProgress } from "../../Graphs";
import { D3Data } from "../../Graphs/types";
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

function ActiveIndicator({
  active = true,
  style = {},
}: {
  active?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div
      className={styles.ActiveIndicatorBox}
      style={{
        ...style,
      }}
    >
      <Stack direction="row" alignItems="center" spacing={"4px"}>
        <CC />
        <p className={styles.ActiveIndicatorTypography}>
          {active ? "Active" : "Inactive"}
        </p>
      </Stack>
    </div>
  );
}

function formatDate(date: Date) {
  const str = date.toLocaleDateString("en-us", options);
  const arr = str.split(" ");
  return [arr[2], arr[0], arr[1]].join(" ");
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
      <p className={styles.ChipTypography}>{props.children}</p>
    </div>
  );
}

export default function OverallDashboard(params: Params) {
  return (
    <div className={styles.OverallDashboardContainer} style={params.style}>
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
        <ActiveIndicator
          active
          style={{ marginLeft: "17px", marginRight: "10px" }}
        />
        <IGI />
        {/* <Dropdown style={{ marginLeft: "auto" }} /> */}
      </div>
      <WeeklyProgress days={params.streak} />
      <Grid
        className="mainGraphs"
        container
        spacing={2}
        sx={{ width: "100%", marginTop: "26px" }}
        columns={23}
        width={"100%"}
      >
        <Grid item xs={5}>
          <Stack direction="column" spacing="17px" width={"auto"}>
            <SmallDataBox
              title="Start Date"
              text={formatDate(params.startDate)}
              Icon={TF}
              titleAboveText
              style={{ width: "282px", height: "98px" }}
            />
            <SmallDataBox
              title="End Date"
              text={formatDate(params.endDate)}
              Icon={PF}
              titleAboveText
              style={{ width: "282px", height: "98px" }}
            />
            <SmallDataBox
              title="Total Completed Sessions"
              text={formatDate(params.startDate)}
              Icon={COI}
              titleAboveText
              style={{ width: "282px", height: "98px" }}
            />
          </Stack>
        </Grid>
        <Grid item xs={8}>
          <BarChart
            width={370}
            height={250}
            style={{ width: "447px", paddingLeft: "30px", height: "324px" }}
            title="Session Completion History"
            data={params.sessionCompletionHistory}
            highlightLargest
          />
        </Grid>
        <Grid item xs={10}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-start"
            marginBottom="29px"
          >
            <DB />
            <p
              className={styles.DashboardTitleTypography}
              style={{
                color: "#2B3674",
                marginLeft: "20px",
              }}
            >
              Last Session
            </p>
          </Stack>
          <Grid container columns={9} rowSpacing={4} columnSpacing={10}>
            <Grid item xs={4} width={"100%"}>
              <SmallDataBox
                title="Questions Completed"
                text={"Need data"}
                Icon={SQ}
                titleAboveText
                style={{ width: "282px", height: "98px" }}
                Chip={() => <Chip color={"#FF9FB34D"}>Math</Chip>}
              />
            </Grid>
            <Grid item xs={4}>
              <SmallDataBox
                title="Prompts Completed"
                text={"Need data"}
                Icon={DI}
                titleAboveText
                Chip={() => <Chip color={"#32D29633"}>Writing</Chip>}
                style={{ width: "282px", height: "98px" }}
              />
            </Grid>
            <Grid item xs={4}>
              <SmallDataBox
                title="Words Read Per Min"
                text={"Need data"}
                Icon={BI}
                titleAboveText
                style={{ width: "282px", height: "98px" }}
                Chip={() => <Chip color={"#008AFC1A"}>Reading</Chip>}
              />
            </Grid>
            <Grid item xs={4}>
              <SmallDataBox
                title="Questions Completed"
                text={"Need data"}
                Icon={QI}
                titleAboveText
                style={{ width: "282px", height: "98px" }}
                Chip={() => <Chip color={"#FBBC054D"}>Trivia</Chip>}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
