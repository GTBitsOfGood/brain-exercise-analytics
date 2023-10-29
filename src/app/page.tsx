"use client";

import LineChart from "@src/components/LineChart";
import BarChart from "@src/components/BarChart";
import StackedBarChart from "@src/components/StackedBarChart";
import SmallDataBox from "@src/components/SmallDataBox";
import PatientGrid from "@src/components/PatientGrid/PatientGrid";
import { IUser, ITableEntry } from "@/common_utils/types";
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

const sampleUsers: ITableEntry[] = [
  {
    name: "John Doe",
    patientDetails: {
      birthdate: "1990-01-01",
    },
    status: true,
    email: "john.doe@example.com",
    chapter: "Georgia Institute of Technology",
    location: {
      country: "USA",
      state: "California",
      city: "Los Angeles",
    },
  },
  {
    name: "Jane Smith",
    patientDetails: {
      birthdate: "1992-02-02",
    },
    email: "jane.smith@example.com",
    chapter: "Yo",
    location: {
      country: "Canada",
      state: "Ontario",
      city: "Toronto",
    },
  },
  {
    name: "Alice Johnson",
    patientDetails: {
      birthdate: "1985-03-03",
    },
    email: "alice.johnson@example.com",
    location: {
      country: "UK",
      state: "England",
      city: "London",
    },
  },
  {
    name: "Bob Brown",
    patientDetails: {
      birthdate: "1987-04-04",
    },
    email: "bob.brown@example.com",
    location: {
      country: "Australia",
      state: "New South Wales",
      city: "Sydney",
    },
  },
  {
    name: "Charlie Davis",
    patientDetails: {
      birthdate: "1995-05-05",
    },
    email: "charlie.davis@example.com",
    location: {
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
    },
  },
  {
    name: "Diana Evans",
    patientDetails: {
      birthdate: "1980-06-06",
    },
    email: "diana.evans@example.com",
    location: {
      country: "Brazil",
      state: "Rio de Janeiro",
      city: "Rio de Janeiro",
    },
  },
  {
    name: "Evan Foster",
    patientDetails: {
      birthdate: "1988-07-07",
    },
    email: "evan.foster@example.com",
    location: {
      country: "Germany",
      state: "Bavaria",
      city: "Munich",
    },
  },
  {
    name: "Fiona Green",
    patientDetails: {
      birthdate: "1993-08-08",
    },
    email: "fiona.green@example.com",
    location: {
      country: "South Africa",
      state: "Gauteng",
      city: "Johannesburg",
    },
  },
  {
    name: "George Harris",
    patientDetails: {
      birthdate: "1975-09-09",
    },
    email: "george.harris@example.com",
    location: {
      country: "Japan",
      state: "Tokyo",
      city: "Tokyo",
    },
  },
  {
    name: "Hannah Adams",
    patientDetails: {
      birthdate: "1997-10-10",
    },
    email: "hannah.adams@example.com",
    location: {
      country: "New Zealand",
      state: "Wellington",
      city: "Wellington",
    },
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <PatientGrid data={sampleUsers} />
      <LineChart
        title='Accuracy'
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
        title='Reading Volume Analysis'
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
        title='Session Completions'
        data={dataStacked}
        hoverable
        percentageChange
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
