"use client";

import React, { useMemo, useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { SqrtIcon, BookIcon, QuestionIcon, DocIcon } from "@src/app/icons";
import useHash from "@src/hooks/useHash";
import styles from "./Metric.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type MetricProps = {
  title: string;
  isClickable: boolean;
};

const Metric = (metricProps: MetricProps) => {
  const router = useRouter();
  const currentPath = usePathname();
  const hash = useHash();

  const isActive = useMemo(
    () =>
      currentPath.startsWith("/patient/dashboard") &&
      hash?.toLowerCase() === metricProps.title.toLowerCase(),
    [currentPath, metricProps.title, hash],
  );

  const handleButtonClick = () => {
    if (currentPath.startsWith("/patient/dashboard/")) {
      router.push(`${currentPath}#${metricProps.title.toLowerCase()}`);
    } else {
      router.push(`/patient/dashboard#${metricProps.title.toLowerCase()}`);
    }
  };

  const icon = useMemo(() => {
    switch (metricProps.title) {
      case "Math":
        return (
          <SqrtIcon
            isActive={metricProps.isClickable}
            className={
              styles[
                `analytics-icon-${metricProps.isClickable ? "active" : "inactive"}`
              ]
            }
          />
        );
      case "Reading":
        return (
          <BookIcon
            isActive={metricProps.isClickable}
            className={
              styles[
                `analytics-icon-${metricProps.isClickable ? "active" : "inactive"}`
              ]
            }
          />
        );
      case "Writing":
        return (
          <DocIcon
            isActive={metricProps.isClickable}
            className={
              styles[
                `analytics-icon-${metricProps.isClickable ? "active" : "inactive"}`
              ]
            }
          />
        );
      case "Trivia":
        return (
          <QuestionIcon
            isActive={metricProps.isClickable}
            className={
              styles[
                `analytics-icon-${metricProps.isClickable ? "active" : "inactive"}`
              ]
            }
          />
        );
      default:
        return <></>;
    }
  }, [metricProps.title, metricProps.isClickable]);

  return (
    <div
      className={`${styles.wrapper} ${!metricProps.isClickable ? styles.disabled : ""}`}
      onClick={metricProps.isClickable ? () => handleButtonClick() : undefined}
    >
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}></div>
        <div
          className={
            styles[`metrics-container-${isActive ? "active" : "inactive"}`]
          }
        >
          <div className={styles["dashboard-icon"]}>{icon}</div>
          <div
            className={
              styles[
                `metric-${metricProps.isClickable ? "active" : "inactive"}`
              ]
            }
          >
            <span>{metricProps.title}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metric;
