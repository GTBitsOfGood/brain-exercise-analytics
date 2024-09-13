import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import { Role, IUser } from "@/common_utils/types";
import { SearchIcon, BarChartIcon, PersonIcon, } from "@src/app/icons";
import ProfilePicIcon from "@src/app/icons/ProfilePicIcon";

import styles from "./NavigationPanel.module.css";
import Metric from "./Metric/Metric";

interface Props {
  onClick: () => void;
}

const NavigationPanel = ({ onClick }: Props) => {
  const user = useSelector<RootState>((state) => state.auth) as IUser;
  const pendingApprovals = useSelector<RootState>(
    (state) => state.generalInfo.pendingApprovals,
  ) as number;

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

  const { firstName, lastName, role, imageLink } = useSelector<
    RootState,
    IUser
  >((state) => state.auth);

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
              <Link
                className={
                  styles[
                    `search-volunteer-${isVolunteerSearch ? "active" : "inactive"}`
                  ]
                }
                href="/volunteer/search"
              >
                <div className={styles["icon-shadow"]}>
                  <SearchIcon className={styles["icon-active"]} />
                </div>
                <span className={styles["search-volunteer-text"]}>
                  Search Volunteer
                </span>
              </Link>
            </div>
            <div className={styles["metrics-container"]}>
              <Link
                className={
                  styles[
                    `approval-container-${isApproval ? "active" : "inactive"}`
                  ]
                }
                href="/volunteer/approval"
              >
                <div className={styles["icon-shadow"]}>
                  <PersonIcon className={styles["icon-active"]} />
                </div>
                <div className={styles["overall-metrics"]}>
                  <span>Pending Approval</span>
                </div>
                <div className={styles["red-bubble"]}>{pendingApprovals}</div>
              </Link>
            </div>
          </>
        )}
        <div className={styles["patient-management"]}>Patient Management</div>
        <div className={styles[`search-patient-container`]}>
          <Link
            className={
              styles[
                `search-patient-${isPatientSearch ? "active" : "inactive"}`
              ]
            }
            href="/patient/search"
          >
            <div className={styles["icon-shadow"]}>
              <SearchIcon className={"icon-active"} />
            </div>
            <span className={styles["search-patient-text"]}>
              Search Patients
            </span>
          </Link>
        </div>
        <div className={styles["metrics-container"]}>
          <Link
            className={`${styles[`overall-metrics-container-${isAnalytics ? "active" : "inactive"}`]} ${!isAnalytics ? styles.disabled : ""}`}
            href="#"
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
          </Link>
          <Metric title="Math" isClickable={isClickable} />
          <Metric title="Reading" isClickable={isClickable} />
          <Metric title="Writing" isClickable={isClickable} />
          <Metric title="Trivia" isClickable={isClickable} />
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.divider} />
        <div className={styles["volunteer-container"]} onClick={onClick}>
        
        {imageLink ? 
          <img
            className={styles["volunteer-pfp"]}
            src={imageLink}
            alt="Volunteer Profile Picture"
          /> :
          <div className={styles["volunteer-pfp"]}><ProfilePicIcon/></div>
        } 
          
          <div className={styles["volunteer-info"]}>
            <span className={styles["user-name"]}>
              {firstName} {lastName}
            </span>
            <span className={styles.position}>{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationPanel;
