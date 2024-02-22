"use client";

import { PersonIcon, PeopleIcon } from "@src/app/icons";
import { CSSProperties, useState } from "react";
import { IAggregatedOverallAnalytics } from "@/common_utils/types";
import { LineChart, SmallDataBox } from "../../Graphs";
import styles from "./OverviewReport.module.scss";

interface Params extends IAggregatedOverallAnalytics {
  style?: CSSProperties;
}
// Need data to pass to Linechart

export default function OverviewReport(params: Params) {
  const [showGraph, setShowGraph] = useState<boolean>(false);
  return (
    <div className={styles.OverviewReport} style={params.style}>
      <p className={styles.title}>Overview / Report</p>
      <div className={styles.dataGrid}>
        <SmallDataBox
          className={styles.box}
          title="Active Users"
          Icon={PersonIcon}
          text={`${params.activeUsers} / ${params.totalUsers}`}
        />
        <div
          className={styles.popupGraphContainer}
          onMouseEnter={() => setShowGraph(true)}
          onMouseLeave={() => setShowGraph(false)}
        >
          <SmallDataBox
            className={styles.box}
            title="Total Users"
            Icon={PeopleIcon}
            text={`${params.totalUsers}`}
          />

          <LineChart
            className={styles.graph}
            width={250}
            height={150}
            title="New Users Over Time"
            hoverable
            data={params.activeHistory}
            style={{
              opacity: showGraph ? 1 : 0,
              zIndex: showGraph ? 1 : -1,
            }}
            percentageChange
          />
        </div>
      </div>
    </div>
  );
}
