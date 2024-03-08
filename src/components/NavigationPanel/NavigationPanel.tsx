import React, { useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  faChartSimple,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

  const isDashboard = useMemo(
    () => currentPath.startsWith("/patient/dashboard"),
    [currentPath],
  );

  return (
    <div className={styles.wrapper}>
      <img
        className={styles["BEI-image"]}
        src="https://c.animaapp.com/2gdwBOyI/img/bei-1-1@2x.png"
        alt="BEI Image"
      />
      <div className={styles["text-wrapper"]}>
        <span className={styles.bei}>Brain Exercise Initiative</span>
        {user.role === Role.NONPROFIT_ADMIN ? (
          <span className={styles["admin-portal"]}>Admin Portal</span>
        ) : (
          user.role === Role.NONPROFIT_PATIENT && (
            <span className={styles["volunteer-portal"]}>Volunteer Portal</span>
          )
        )}
        <div className={styles.divider} />
        {user.role === Role.NONPROFIT_ADMIN && (
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
                  <FontAwesomeIcon
                    className={
                      styles[
                        `icon-${isVolunteerSearch ? "active" : "inactive"}`
                      ]
                    }
                    icon={faMagnifyingGlass}
                    size="sm"
                  />
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
                    `overall-metrics-container-${isApproval ? "active" : "inactive"}`
                  ]
                }
                onClick={() => router.push("/volunteer/approval")}
              >
                <div className={styles["icon-shadow"]}>
                  <FontAwesomeIcon
                    className={
                      styles[`icon-${isApproval ? "active" : "inactive"}`]
                    }
                    icon={faUser}
                    size="sm"
                  />
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
              <FontAwesomeIcon
                className={
                  styles[`icon-${isPatientSearch ? "active" : "inactive"}`]
                }
                icon={faMagnifyingGlass}
                size="sm"
              />
            </div>
            <span className={styles["search-patient-text"]}>
              Search Patients
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
            onClick={() => router.push("/patient/dashboard")}
          >
            <div className={styles["icon-shadow"]}>
              <FontAwesomeIcon
                className={
                  styles[`icon-${isDashboard ? "active" : "inactive"}`]
                }
                icon={faChartSimple}
                size="sm"
              />
            </div>
            <div className={styles["overall-metrics"]}>
              <span>Patient Analytics</span>
            </div>
          </div>
          <Metric title="Math" />
          <Metric title="Reading" />
          <Metric title="Writing" />
          <Metric title="Trivia" />
        </div>
        <div className={styles.divider} />
        <div className={styles["patient-container"]} onClick={() => onclick}>
          <img
            className={styles["patient-pfp"]}
            src="https://via.placeholder.com/81x81"
            alt="Patient Profile Picture"
          />
          <div className={styles["patient-info"]} onClick={onClick}>
            <span className={styles["user-name"]}>User Name</span>
            <span className={styles.position}>Position or title</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
