"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import VolunteerSearch from "@src/components/VolunteerSearch/VolunteerSearch";
import VolunteerApprovalGrid from "@src/components/VolunteerApprovalGrid/VolunteerApprovalGrid";
import Modal from "@src/components/Modal/Modal";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import { update } from "@src/redux/reducers/generalReducer";
import { classes } from "@src/utils/utils";

import { internalRequest } from "@src/utils/requests";
import {
  AdminApprovalStatus,
  SortField,
  HttpMethod,
  IVolunteerTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";

import firebaseInit from "@src/firebase/config";
import { RootState } from "@src/redux/rootReducer";
import NetlifyLogo from "@src/components/NetlifyLogo/NetlifyLogo";
import styles from "./page.module.css";

firebaseInit();

export default function Page() {
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

  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<IVolunteerTableEntry[]>(
    [],
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(8)
  const [totalEntries, setTotalEntries] = useState(0)

  const fetchUsers = useCallback(() => {
    setLoading(true);
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
        page: currentPage,
        sortParams: sortField,
        entriesPerPage: entriesPerPage
      },
    }).then((res) => {
      setPageCount(res?.numPages ?? 0);
      setFilteredUsers(res?.data ?? []);
      setTotalEntries(res?.numRecords ?? 0)
      dispatch(update({ pendingApprovals: res?.numRecords ?? 0 }));
      setLoading(false);
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
    currentPage,
    sortField,
    dispatch,
    entriesPerPage
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setCurrentPage(0);
  }, [
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
    sortField,
    entriesPerPage
  ]);

  return (
    <div className={styles.container}>
      <title>Volunteer Approval | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0" }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
      <div className={classes(styles["search-container"])}>
        <p className={styles["intro-text"]}>Search for a volunteer here!</p>
        <div className={styles["search-wrapper"]}>
          <VolunteerSearch />
        </div>
      </div>
      <div
        className={classes(
          styles["table-container"],
          styles["table-container-show"],
        )}
      >
        <VolunteerApprovalGrid
          data={filteredUsers}
          sortField={sortField}
          setSortField={setSortField}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
          currentPage={currentPage}
          refreshUsers={fetchUsers}
          entriesPerPage={entriesPerPage}
          setEntriesPerPage={setEntriesPerPage}
          totalEntries={totalEntries}
        />
      </div>
      <div className={styles.netlify}>
        <NetlifyLogo></NetlifyLogo>
      </div>
    </div>
  );
}
