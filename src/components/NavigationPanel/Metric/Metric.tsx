"use client";

import React, { useMemo } from "react";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import { SqrtIcon, BookIcon, QuestionIcon, DocIcon } from "@src/app/icons";
import useHash from "@src/hooks/useHash";
import Link from "next/link";
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
  const currentPath = usePathname();
  const hash = useHash();

  const isActive = useMemo(
    () =>
      currentPath.startsWith("/patient/analytics") &&
      hash?.toLowerCase() === metricProps.title.toLowerCase(),
    [currentPath, metricProps.title, hash],
  );

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
    <Link
      className={`${styles.wrapper} ${!metricProps.isClickable ? styles.disabled : ""}`}
      href={
        metricProps.isClickable ? `#${metricProps.title.toLowerCase()}` : ""
      }
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
    </Link>
  );
};

export default Metric;
