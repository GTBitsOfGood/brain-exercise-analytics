"use client";

import LineChart from "@src/components/LineChart";
import BarChart from "@src/components/BarChart";
import StackedBarChart from "@src/components/StackedBarChart";
import SmallDataBox from "@src/components/SmallDataBox";
import { Icon } from "./icons/barChartIcon";
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
      <LineChart
        title="Accuracy"
        data={dataLine}
        yAxis={{
          min: 0,
          max: 1,
          numDivisions: 5,
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
      />
      <SmallDataBox
        title={"Number of questions completed"}
        Icon={Icon}
        text={"20 / 1 hr 50 min"}
      />
      {/* <BarChart data={data} /> */}
    </main>
  );
}
