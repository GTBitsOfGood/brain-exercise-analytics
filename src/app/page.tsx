"use client";

import {
  BarChart,
  LineChart,
  StackedBarChart,
  SmallDataBox,
} from "@src/components/Graphs";
import OverviewReport from "@src/components/Dashboard/OverviewReport";
import OverallDashboard from "@src/components/Dashboard/OverallDashboard";
import { Divider } from "@mui/material";
import { Days } from "@/common_utils/types";
import { personIcon } from "./icons";
import styles from "./page.module.css";

const dataLine = [
  {
    interval: "9/17",
    value: 0.4,
  },
  {
    interval: "9/24",
    value: 0.23,
  },
  {
    interval: "10/4",
    value: 0.01,
  },
  {
    interval: "10/12",
    value: 0.25,
  },
  {
    interval: "10/19",
    value: 0.7,
  },
  {
    interval: "10/25",
    value: 0.55,
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

export default function Home() {
  return (
    <main className={styles.main}>
      <OverviewReport activeUsers={10} totalUsers={200} />
      <Divider
        orientation="horizontal"
        flexItem
        sx={{ marginTop: "50px", marginBottom: "50px" }}
      />
      <OverallDashboard
        streak={[Days.Monday, Days.Tuesday]}
        startDate={new Date("2020-12-10")}
        endDate={new Date("2023-07-23")}
        sessionCompletionHistory={dataBar}
      />
      <LineChart
      style={{marginTop: "100px"}}
        title="Accuracy"
        data={dataLine}
        yAxis={{
          min: 0,
          max: 1,
          numDivisions: 9,
          format: (d) => `${JSON.stringify(Math.round(100 * d.valueOf()))}%`,
        }}
        hoverable
        percentageChange
        gradient
      />
      <BarChart
        title="Reading Volume Analysis"
        data={dataBar}
        yAxis={{
          min: 0,
          max: 7,
          numDivisions: 5,
          format: (d) => {
            if (d.valueOf() === 0) {
              return JSON.stringify(d);
            }
            if (d.valueOf() <= 2) {
              return "1-2";
            }
            if (d.valueOf() <= 4) {
              return "3-4";
            }
            if (d.valueOf() <= 6) {
              return "5-6";
            }
            return "6+";
          },
        }}
        hoverable
        percentageChange
      />
      <StackedBarChart
        title="Session Completions"
        data={dataStacked}
        hoverable
        percentageChange
      />
      <SmallDataBox
        title={"Number of questions completed"}
        Icon={personIcon}
        text={"20 / 1 hr 50 min"}
      />
      {/* <BarChart data={data} /> */}
    </main>
  );
}
