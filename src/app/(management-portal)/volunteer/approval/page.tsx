"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TwoVolunteersIcon from "@src/app/icons/TwoVolunteersIcon";
import Search from "@src/components/Search/Search";

import VolunteerApprovalGrid from "@src/components/VolunteerApprovalGrid/VolunteerApprovalGrid";
import { classes } from "@src/utils/utils";
import { internalRequest } from "@src/utils/requests";
import {
  AdminApprovalStatus,
  SortField,
  HttpMethod,
  IVolunteerTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";

import { getAuth } from "firebase/auth";
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
    additionalAffiliations,
    dateOfJoins,
    beiChapters,
    secondaryPhoneNumbers,
    secondaryNames,
  } = useSelector((state: RootState) => state.patientSearch);

  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<IVolunteerTableEntry[]>(
    [],
  );

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
          url: "/api/volunteer/filter-volunteer",
          method: HttpMethod.POST,
          body: {
            params: {
              name: fullName,
              dateOfBirths: Array.from(dateOfBirths),
              emails: Array.from(emails),
              additionalAffiliations: Array.from(additionalAffiliations),
              secondaryNames: Array.from(secondaryNames),
              secondaryPhoneNumbers: Array.from(secondaryPhoneNumbers),
              beiChapters: Array.from(beiChapters),
              active,
              countries: Array.from(countries),
              states: Array.from(states),
              cities: Array.from(cities),
              dateOfJoins: Array.from(dateOfJoins),
              approved: [AdminApprovalStatus.PENDING],
            },
            page: currentPage,
            sortParams: sortField,
          },
        }).then((res) => {
          setPageCount(res?.numPages ?? 0);
          setFilteredUsers(res?.data ?? []);
        });
      }
    });
  }, [
    fullName,
    active,
    countries,
    states,
    cities,
    dateOfBirths,
    emails,
    additionalAffiliations,
    dateOfJoins,
    beiChapters,
    secondaryPhoneNumbers,
    secondaryNames,
    sortField,
    currentPage,
  ]);

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
    additionalAffiliations,
    dateOfJoins,
    beiChapters,
    secondaryPhoneNumbers,
    secondaryNames,
    sortField,
  ]);

  return (
    <div className={styles.container}>
      <div className={classes(styles["search-container"])}>
        <p className={styles["intro-text"]}>Search for a volunteer here!</p>
        <div className={styles["search-wrapper"]}>
          <Search />
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
          <p className={styles["table-header-text"]}>Pending Approval</p>
        </div>
        <VolunteerApprovalGrid
          data={filteredUsers}
          sortField={sortField}
          setSortField={setSortField}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
