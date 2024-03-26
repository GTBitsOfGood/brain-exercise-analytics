import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SearchIcon, BarChartIcon, PersonIcon } from "@src/app/icons";
import { Role, IUser } from "@/common_utils/types";
import { RootState } from "@src/redux/rootReducer";
import { useSelector } from "react-redux";
import Metric from "./Metric/Metric";
import styles from "./NavigationPanel.module.css";

interface Props {
  onClick: () => void;
}

const NavigationPanel = ({ onClick }: Props) => {
  const user = useSelector<RootState>((state) => state.auth) as IUser;

  const router = useRouter();
  const currentPath = usePathname();

  const isClickable = useMemo(
    () => currentPath.startsWith("/patient/analytics"),
    [currentPath],
  );

  const isPatientSearch = useMemo(
    () => currentPath.startsWith("/patient/search"),
    [currentPath],
  );

  const isVolunteerSearch = useMemo(
    () => currentPath.startsWith("/volunteer/search"),
    [currentPath],
  );

  const isApproval = useMemo(
    () => currentPath.startsWith("/volunteer/approval"),
    [currentPath],
  );

  const isAnalytics = useMemo(
    () => currentPath.startsWith("/patient/analytics"),
    [currentPath],
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.topSection}>
        <div className={styles.center}>
          <img
            className={styles["BEI-image"]}
            src="https://c.animaapp.com/2gdwBOyI/img/bei-1-1@2x.png"
            alt="BEI Image"
          />
        </div>
        <div className={styles["text-wrapper"]}>
          <span className={styles.bei}>Brain Exercise Initiative</span>
          {user.role !== Role.NONPROFIT_VOLUNTEER ? (
            <span className={styles["admin-portal"]}>Admin Portal</span>
          ) : (
            <span className={styles["volunteer-portal"]}>Volunteer Portal</span>
          )}
        </div>
        <div className={styles.divider} />
      </div>

      <div className={styles.middleSection}>
        {user.role !== Role.NONPROFIT_VOLUNTEER && (
          <>
            <div className={styles["volunteer-management"]}>
              Volunteer Management
            </div>
            <div className={styles[`volunteer-patient-container`]}>
              <div
                className={
                  styles[
                    `search-volunteer-${isVolunteerSearch ? "active" : "inactive"}`
                  ]
                }
                onClick={() => router.push("/volunteer/search")}
              >
                <div className={styles["icon-shadow"]}>
                  <SearchIcon className={styles["icon-active"]} />
                </div>
                <span className={styles["search-volunteer-text"]}>
                  Search Volunteer
                </span>
              </div>
            </div>
            <div className={styles["metrics-container"]}>
              <div
                className={
                  styles[
                    `approval-container-${isApproval ? "active" : "inactive"}`
                  ]
                }
                onClick={() => router.push("/volunteer/approval")}
              >
                <div className={styles["icon-shadow"]}>
                  <PersonIcon className={styles["icon-active"]} />
                </div>
                <div className={styles["overall-metrics"]}>
                  <span>Pending Approval</span>
                </div>
                <div className={styles["red-bubble"]}>1</div>
              </div>
            </div>
          </>
        )}
        <div className={styles["patient-management"]}>Patient Management</div>
        <div className={styles[`search-patient-container`]}>
          <div
            className={
              styles[
                `search-patient-${isPatientSearch ? "active" : "inactive"}`
              ]
            }
            onClick={() => router.push("/patient/search")}
          >
            <div className={styles["icon-shadow"]}>
              <SearchIcon className={"icon-active"} />
            </div>
            <span className={styles["search-patient-text"]}>
              Search Patients
            </span>
          </div>
        </div>
        <div className={styles["metrics-container"]}>
          <div
            className={`${styles[`overall-metrics-container-${isAnalytics ? "active" : "inactive"}`]} ${!isAnalytics ? styles.disabled : ""}`}
            onClick={() => router.push("#")}
          >
            <div className={styles["icon-shadow"]}>
              <BarChartIcon
                className={`icon-${isAnalytics ? "active" : "inactive"}`}
                isActive={isAnalytics}
              />
            </div>
            <div className={styles["overall-metrics"]}>
              <span>Patient Analytics</span>
            </div>
          </div>
          <Metric title="Math" isClickable={isClickable} />
          <Metric title="Reading" isClickable={isClickable} />
          <Metric title="Writing" isClickable={isClickable} />
          <Metric title="Trivia" isClickable={isClickable} />
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.divider} />
        <div className={styles["patient-container"]} onClick={onClick}>
          <img
            className={styles["patient-pfp"]}
            src="https://via.placeholder.com/81x81"
            alt="Patient Profile Picture"
          />
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
