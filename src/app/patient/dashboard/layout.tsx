import React from "react";
import { OverviewReport } from "@src/components/Dashboard";
import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <div className={styles.overviewReportContainer}>
        <OverviewReport activeUsers={10} totalUsers={200} />
      </div>
      {children}
    </div>
  );
}
