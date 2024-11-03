import React, { useMemo, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import {
  Role,
  IUser,
  HttpMethod,
  SearchResponseBody,
  IVolunteerTableEntry,
  AdminApprovalStatus,
} from "@/common_utils/types";
import { internalRequest } from "@src/utils/requests";
import { SearchIcon, BarChartIcon, PersonIcon, InfoIcon } from "@src/app/icons";
import HouseIcon from "@src/app/icons/HouseIcon";
import ProfilePicIcon from "@src/app/icons/ProfilePicIcon";
import { update } from "@src/redux/reducers/generalReducer";

import styles from "./NavigationPanel.module.css";

interface Props {
  onClick: () => void;
}

const NavigationPanel = ({ onClick }: Props) => {
  const user = useSelector<RootState>((state) => state.auth) as IUser;
  const pendingApprovals = useSelector<RootState>(
    (state) => state.generalInfo.pendingApprovals,
  ) as number;

  const {
    fullName,
    active,
    countries,
    states,
    cities,
    dateOfBirths,
    emails,
    dateOfJoins,
    beiChapters,
    volunteerRoles,
  } = useSelector((state: RootState) => state.volunteerSearch);

  const dispatch = useDispatch();

  const fetchUsers = useCallback(() => {
    internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      url: "/api/volunteer/filter-volunteer",
      method: HttpMethod.POST,
      body: {
        params: {
          name: fullName,
          dateOfBirths,
          emails,
          beiChapters,
          active,
          countries,
          states,
          cities,
          dateOfJoins,
          roles: volunteerRoles,
          approved: [AdminApprovalStatus.PENDING],
        },
      },
    }).then((res) => {
      dispatch(update({ pendingApprovals: res?.numRecords }));
    });
  }, [
    fullName,
    dateOfBirths,
    emails,
    beiChapters,
    active,
    countries,
    states,
    cities,
    dateOfJoins,
    volunteerRoles,
    dispatch,
  ]);

  // fetchUsers on first render
  useEffect(() => {
    if (user.role !== Role.NONPROFIT_VOLUNTEER) {
      fetchUsers();
    }
  }, []);

  const currentPath = usePathname();

  const isPatientSearch = useMemo(
    () => currentPath.startsWith("/patient/search"),
    [currentPath],
  );

  const isVolunteerSearch = useMemo(
    () => currentPath.startsWith("/volunteer/search"),
    [currentPath],
  );

  const isChapterSearch = useMemo(
    () => currentPath.startsWith("/chapter/search"),
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
          {user.role === Role.NONPROFIT_VOLUNTEER && (
            <span className={styles["volunteer-portal"]}>Volunteer Portal</span>
          )}
          {user.role === Role.NONPROFIT_ADMIN && (
            <div className={styles["role-container"]}>
              <div className={styles["admin-portal"]}>Admin Portal</div>
            </div>
          )}
          {user.role !== Role.NONPROFIT_VOLUNTEER &&
            user.role !== Role.NONPROFIT_ADMIN && (
              <div className={styles["role-container"]}>
                <div className={styles["admin-portal"]}>Admin Portal</div>
                <div className={styles["admin-role"]}>{user.role}</div>
              </div>
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

            {user.role === Role.NONPROFIT_CHAPTER_PRESIDENT ? (
              <div className={styles[`chapter-search-container`]}>
                <Link
                  className={
                    styles[
                      `search-chapter-${isChapterSearch ? "active" : "inactive"}`
                    ]
                  }
                  href={`/chapter/${user.chapter}`}
                >
                  <div className={styles["icon-shadow"]}>
                    <HouseIcon />
                  </div>
                  <span className={styles["search-chapter-text"]}>
                    My Chapter
                  </span>
                </Link>
              </div>
            ) : (
              <div className={styles[`chapter-search-container`]}>
                <Link
                  className={
                    styles[
                      `search-chapter-${isChapterSearch ? "active" : "inactive"}`
                    ]
                  }
                  href="/chapter/search"
                >
                  <div className={styles["icon-shadow"]}>
                    <SearchIcon className={styles["icon-active"]} />
                  </div>
                  <span className={styles["search-chapter-text"]}>
                    Search Chapter
                  </span>
                </Link>
              </div>
            )}

            <div className={styles[`volunteer-search-container`]}>
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
                {pendingApprovals > 0 && (
                  <div className={styles["red-bubble"]}>{pendingApprovals}</div>
                )}
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
              {!isAnalytics && (
                <div className={styles["info-icon-wrapper"]}>
                  <div className={styles["info-icon"]}>
                    <InfoIcon className={styles["info-icon"]} />
                  </div>
                  <div className={styles["info-icon-text"]}>
                    <p>Search a patient to see patient analytics.</p>
                  </div>
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <div className={styles.divider} />
        <div className={styles["volunteer-container"]} onClick={onClick}>
          {imageLink ? (
            <img
              className={styles["volunteer-pfp"]}
              src={imageLink}
              alt="Volunteer Profile Picture"
            />
          ) : (
            <div className={styles["volunteer-pfp"]}>
              <ProfilePicIcon />
            </div>
          )}

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
