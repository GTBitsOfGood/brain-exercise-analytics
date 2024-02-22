"use client";

import React, { useEffect, useState } from "react";
import { OverviewReport } from "@src/components/Dashboard";
import { internalRequest } from "@src/utils/requests";
import {
  DateRangeEnum,
  HttpMethod,
  IAggregatedOverallAnalytics,
} from "@/common_utils/types";
import styles from "./layout.module.scss";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [patientData, setPatientData] = useState<IAggregatedOverallAnalytics>({
    activeUsers: 0,
    totalUsers: 0,
    activeHistory: [],
  });
  useEffect(() => {
    internalRequest({
      url: "/api/patient/analytics/overview",
      method: HttpMethod.GET,
      queryParams: {
        range: DateRangeEnum.RECENT,
      },
    }).then((data) => {
      setPatientData(data as IAggregatedOverallAnalytics);
    });
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.overviewReportContainer}>
        <OverviewReport
          activeUsers={patientData.activeUsers}
          totalUsers={patientData.totalUsers}
          activeHistory={patientData.activeHistory}
        />
      </div>
      {children}
    </div>
  );
}
