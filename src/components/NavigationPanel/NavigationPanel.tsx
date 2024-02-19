"use client";

import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Metric from "./Metric/Metric";
import styles from "./NavigationPanel.module.css";

const NavigationPanel = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const isSearch = useMemo(
    () => currentPath.startsWith("/patient/search"),
    [currentPath]
  );

  const isDashboard = useMemo(
    () => currentPath.startsWith("/patient/dashboard"),
    [currentPath]
  );
  function handleClick() {
    // console.log("open Edit Modal");
  }

  return (
    <div className={styles.wrapper}>
      <img
        className={styles["BEI-image"]}
        src="https://c.animaapp.com/2gdwBOyI/img/bei-1-1@2x.png"
        alt="BEI Image"
      />
      <div className={styles["text-wrapper"]}>
        <span className={styles.bei}>Brain Exercise Initiative</span>
        <span className={styles["volunteer-portal"]}>Volunteer Portal</span>
        <div className={styles.divider} />
        <div className={styles[`search-patient-container`]}>
          <div
            className={
              styles[`search-patient-${isSearch ? "active" : "inactive"}`]
            }
            onClick={() => router.push("/patient/search")}
          >
            <div className={styles["icon-shadow"]}>
              <FontAwesomeIcon
                className={styles["statistics-icon"]}
                icon={faChartSimple}
                size="sm"
              />
            </div>
            <span className={styles["search-patient-text"]}>
              SEARCH PATIENT
            </span>
          </div>
        </div>
        <div className={styles["metrics-container"]}>
          <div
            className={
              styles[
                `overall-metrics-container-${
                  isDashboard ? "active" : "inactive"
                }`
              ]
            }
            onClick={() => {
              if (!isDashboard) {
                router.push("/patient/dashboard");
              } else {
                router.push("#");
              }
            }}
          >
            <div className={styles["icon-shadow"]}>
              <FontAwesomeIcon
                className={styles["statistics-icon"]}
                icon={faChartSimple}
                size="sm"
              />
            </div>
            <div className={styles["overall-metrics"]}>
              <span>PATIENT OVERALL METRICS</span>
            </div>
          </div>
          <Metric title="math" />
          <Metric title="reading" />
          <Metric title="writing" />
          <Metric title="trivia" />
        </div>
        <div className={styles.divider} />
        <div className={styles["patient-container"]}>
          <a href="#" onClick={handleClick}>
            <img
              className={styles["patient-pfp"]}
              src="https://via.placeholder.com/81x81"
              alt="Patient Profile Picture"
            />
          </a>
          <div className={styles["patient-info"]}>
            <span className={styles["user-name"]}>User Name</span>
            <span className={styles.position}>Position or title</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
