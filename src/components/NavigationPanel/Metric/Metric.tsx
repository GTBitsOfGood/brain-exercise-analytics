"use client";

import React from "react";
import { Poppins } from "next/font/google";
import DashboardIcon from "@mui/icons-material/Dashboard";
import { useRouter, usePathname } from "next/navigation";
import styles from "./Metric.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type MetricProps = {
  title: string;
};

const Metric = (MetricProps: MetricProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleButtonClick = () => {
    if (pathname.startsWith("/api/patient/dashboard/")) {
      router.push(`${pathname}#${MetricProps.title}`);
    } else {
      router.push(`/api/patient/dashboard#${MetricProps.title}`);
    }
  };

  return (
    <div className={styles.wrapper}>
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}></div>
        <div className={styles["metrics-container"]}>
          <div className={styles["dashboard-icon"]}>
            <DashboardIcon />
          </div>
          <div className={styles.metric}>
            <span onClick={handleButtonClick}>
              {MetricProps.title.toUpperCase()}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metric;
