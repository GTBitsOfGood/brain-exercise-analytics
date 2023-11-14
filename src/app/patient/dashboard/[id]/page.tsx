"use client";

import OverallDashboard from "@src/components/Dashboard/OverallDashboard/OverallDashboard";
import { Days } from "@/common_utils/types";
import { dataBar } from "@src/utils/patients";

import styles from "./page.module.scss";

export function Divider() {
  return (
    <div
      style={{
        width: "100%",
        height: "2px",
        backgroundColor: "#c8c8c8",
        margin: "4.2% 0",
      }}
    />
  );
}

export default function Page() {
  return (
    <div className={styles.container}>
      <Divider />
      <div className={styles.overallPatientContainer}>
        <OverallDashboard
          streak={[Days.Monday, Days.Tuesday, Days.Friday]}
          startDate={new Date("2020-12-10")}
          endDate={new Date("2023-07-23")}
          sessionCompletionHistory={dataBar}
        />
      </div>
    </div>
  );
}
