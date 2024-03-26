"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TwoVolunteersIcon from "@src/app/icons/TwoVolunteersIcon";
import VolunteerSearch from "@src/components/VolunteerSearch/VolunteerSearch";

import VolunteerGrid from "@src/components/VolunteerGrid/VolunteerGrid";
import { classes } from "@src/utils/utils";
import { internalRequest } from "@src/utils/requests";
import {
  SortField,
  HttpMethod,
  IVolunteerTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";

import firebaseInit from "@src/firebase/config";

import { RootState } from "@src/redux/rootReducer";
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

  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<IVolunteerTableEntry[]>(
    [],
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  const fetchUsers = useCallback(() => {
    internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      url: "/api/volunteer/filter-volunteer",
      method: HttpMethod.POST,
      body: {
        params: {
          name: fullName,
          dateOfBirths: Array.from(dateOfBirths),
          emails: Array.from(emails),
          beiChapters: Array.from(beiChapters),
          active,
          countries: Array.from(countries),
          states: Array.from(states),
          cities: Array.from(cities),
          dateOfJoins: Array.from(dateOfJoins),
          role: volunteerRoles,
        },
        page: currentPage,
        sortParams: sortField,
      },
    }).then((res) => {
      setPageCount(res?.numPages ?? 0);
      setFilteredUsers(res?.data ?? []);
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
  ]);

  return (
    <div className={styles.container}>
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
        <div className={styles["table-header"]}>
          <TwoVolunteersIcon />
          <p className={styles["table-header-text"]}>Volunteer List</p>
        </div>
        <VolunteerGrid
          data={filteredUsers}
          sortField={sortField}
          setSortField={setSortField}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
          currentPage={currentPage}
          refreshUsers={fetchUsers}
        />
      </div>
    </div>
  );
}
