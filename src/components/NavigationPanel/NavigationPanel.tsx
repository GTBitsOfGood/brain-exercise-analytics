import React from "react";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { faChartSimple } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Metric from "./Metric/Metric";
import styles from "./NavigationPanel.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const NavigationPanel = () => {
  const router = useRouter();
  return (
    <div className={styles.wrapper}>
      <img
        className={styles["BEI-image"]}
        src="https://c.animaapp.com/2gdwBOyI/img/bei-1-1@2x.png"
        alt="BEI Image"
      />
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}>
          <span className={styles.bei}>Brain Exercise Initiative</span>
          <span className={styles["volunteer-portal"]}>Volunteer Portal</span>
          <div className={styles.divider}>
            <hr />
          </div>
          <div className={styles["search-patient-container"]}>
            <div
              className={styles["search-patient"]}
              onClick={() => router.push("/api/patient/search")}
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
            <div className={styles["overall-metrics-container"]}>
              <div className={styles["icon-shadow"]}>
                <FontAwesomeIcon
                  className={styles["statistics-icon"]}
                  icon={faChartSimple}
                  size="sm"
                />
              </div>
              <div className={styles["overall-metrics"]}>
                <span onClick={() => router.push("/api/patient/dashboard")}>
                  PATIENT OVERALL METRICS
                </span>
              </div>
            </div>
            <Metric title="math" />
            <Metric title="reading" />
            <Metric title="writing" />
            <Metric title="trivia" />
          </div>
          <div className={styles.divider}>
            <hr />
          </div>
          <div className={styles["patient-container"]}>
            <img
              className={styles["patient-pfp"]}
              src="https://via.placeholder.com/81x81"
            />
            <div className={styles["patient-info"]}>
              <span className={styles["user-name"]}>User Name</span>
              <span className={styles.position}>Position or title</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default NavigationPanel;
