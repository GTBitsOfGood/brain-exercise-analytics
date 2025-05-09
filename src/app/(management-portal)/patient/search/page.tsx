"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Search from "@src/components/Search/Search";

import PatientGrid from "@src/components/PatientGrid/PatientGrid";
import { classes } from "@src/utils/utils";
import { internalRequest } from "@src/utils/requests";
import {
  SortField,
  HttpMethod,
  IPatientTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import Modal from "@src/components/Modal/Modal";

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
    additionalAffiliations,
    dateOfJoins,
    beiChapters,
    secondaryPhones,
    secondaryNames,
  } = useSelector((state: RootState) => state.patientSearch);

  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<IPatientTableEntry[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState(8);
  const [totalEntries, setTotalEntries] = useState(0);

  useEffect(() => {
    setLoading(true);
    internalRequest<SearchResponseBody<IPatientTableEntry>>({
      url: "/api/patient/filter-patient",
      method: HttpMethod.POST,
      body: {
        params: {
          name: fullName,
          dateOfBirths,
          emails,
          additionalAffiliations,
          secondaryNames,
          secondaryPhones,
          beiChapters,
          active,
          countries,
          states,
          cities,
          dateOfJoins,
        },
        page: currentPage,
        sortParams: sortField,
        entriesPerPage,
      },
    }).then((res) => {
      setPageCount(res?.numPages ?? 0);
      setFilteredUsers(res?.data ?? []);
      setTotalEntries(res?.numRecords ?? 0);
      setLoading(false);
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
    secondaryPhones,
    secondaryNames,
    sortField,
    currentPage,
    entriesPerPage,
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
    secondaryPhones,
    secondaryNames,
    sortField,
    entriesPerPage,
  ]);

  return (
    <div className={styles.container}>
      <title>Patient Search | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0" }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
      <div className={classes(styles["search-container"])}>
        <p className={styles["intro-text"]}>Search for Patients Here!</p>
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
        <PatientGrid
          data={filteredUsers}
          sortField={sortField}
          setSortField={setSortField}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
          currentPage={currentPage}
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
