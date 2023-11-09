"use client";

import LineChart from "@src/components/LineChart";
import BarChart from "@src/components/BarChart";
import StackedBarChart from "@src/components/StackedBarChart";
import SmallDataBox from "@src/components/SmallDataBox";
import PatientGrid from "@src/components/PatientGrid/PatientGrid";
import { ITableEntry } from "@/common_utils/types";
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
      secondaryContactName: "Jane Doe",
      secondaryContactPhone: "555-222-1515",
    },
    status: true,
    email: "john.doe@example.com",
    chapter: "Georgia Institute of Technology",
    location: {
      country: "USA",
      state: "California",
      city: "Los Angeles",
    },
    startDate: "2020-05-05",
  },
  {
    name: "Jane Smith",
    patientDetails: {
      birthdate: "1992-02-02",
      secondaryContactName: "Ella Smith",
      secondaryContactPhone: "555-334-7890",
    },
    status: true,
    email: "jane.smith@example.com",
    chapter: "Toronto Central",
    location: {
      country: "Canada",
      state: "Ontario",
      city: "Toronto",
    },
    startDate: "2021-01-10",
  },
  {
    name: "Alice Johnson",
    patientDetails: {
      birthdate: "1985-03-03",
      secondaryContactName: "Michael Johnson",
      secondaryContactPhone: "555-456-7890",
    },
    status: false,
    email: "alice.johnson@example.com",
    chapter: "London Health Sciences Center",
    location: {
      country: "UK",
      state: "England",
      city: "London",
    },
    startDate: "2021-02-20",
  },
  {
    name: "Bob Brown",
    patientDetails: {
      birthdate: "1987-04-04",
      secondaryContactName: "Linda Brown",
      secondaryContactPhone: "555-567-8901",
    },
    status: true,
    email: "bob.brown@example.com",
    chapter: "Sydney Medical Center",
    location: {
      country: "Australia",
      state: "New South Wales",
      city: "Sydney",
    },
    startDate: "2021-03-15",
  },
  {
    name: "Charlie Davis",
    patientDetails: {
      birthdate: "1995-05-05",
      secondaryContactName: "Sarah Davis",
      secondaryContactPhone: "555-678-9012",
    },
    status: false,
    email: "charlie.davis@example.com",
    chapter: "Mumbai Health Forum",
    location: {
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
    },
    startDate: "2021-04-22",
  },
  {
    name: "Diana Evans",
    patientDetails: {
      birthdate: "1980-06-06",
      secondaryContactName: "Peter Evans",
      secondaryContactPhone: "555-789-0123",
    },
    status: true,
    email: "diana.evans@example.com",
    chapter: "Rio de Janeiro Health Institute",
    location: {
      country: "Brazil",
      state: "Rio de Janeiro",
      city: "Rio de Janeiro",
    },
    startDate: "2021-05-30",
  },
  {
    name: "Evan Foster",
    patientDetails: {
      birthdate: "1988-07-07",
      secondaryContactName: "Julia Foster",
      secondaryContactPhone: "555-890-1234",
    },
    status: false,
    email: "evan.foster@example.com",
    chapter: "Bavarian Medical Society",
    location: {
      country: "Germany",
      state: "Bavaria",
      city: "Munich",
    },
    startDate: "2021-07-14",
  },
  {
    name: "Fiona Green",
    patientDetails: {
      birthdate: "1993-08-08",
      secondaryContactName: "Mark Green",
      secondaryContactPhone: "555-901-2345",
    },
    status: true,
    email: "fiona.green@example.com",
    chapter: "Johannesburg Health Chapter",
    location: {
      country: "South Africa",
      state: "Gauteng",
      city: "Johannesburg",
    },
    startDate: "2021-08-28",
  },
  {
    name: "George Harris",
    patientDetails: {
      birthdate: "1975-09-09",
      secondaryContactName: "Lucy Harris",
      secondaryContactPhone: "555-012-3456",
    },
    status: true,
    email: "george.harris@example.com",
    chapter: "Tokyo Medical Association",
    location: {
      country: "Japan",
      state: "Tokyo",
      city: "Tokyo",
    },
    startDate: "2021-09-12",
  },
  {
    name: "Hannah Adams",
    patientDetails: {
      birthdate: "1997-10-10",
      secondaryContactName: "Oliver Adams",
      secondaryContactPhone: "555-123-4567",
    },
    status: false,
    email: "hannah.adams@example.com",
    chapter: "Wellington Health Services",
    location: {
      country: "New Zealand",
      state: "Wellington",
      city: "Wellington",
    },
    startDate: "2021-10-05",
  },
];

export default function Home() {
  return (
    <main className={styles.main}>
      <PatientGrid data={sampleUsers} />
      <LineChart
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
        Icon={Icon}
        text={"20 / 1 hr 50 min"}
      />
      {/* <BarChart data={data} /> */}
    </main>
  );
}
