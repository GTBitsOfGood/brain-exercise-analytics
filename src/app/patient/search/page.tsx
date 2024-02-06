"use client";

import { useCallback, useEffect, useState } from "react";
import { Dashboard } from "@mui/icons-material";
import Search from "@src/components/Search/Search";

import PatientGrid from "@src/components/PatientGrid/PatientGrid";
import { classes } from "@src/utils/utils";
import { internalRequest } from "@src/utils/requests";
import {
  SortField,
  HttpMethod,
  ITableEntry,
  FilteredUsersResponse,
} from "@/common_utils/types";

import { getAuth } from "firebase/auth";
import firebaseInit from "@src/firebase/config";

import styles from "./page.module.css";

firebaseInit();

export default function Page() {
  const [viewTable, setViewTable] = useState<boolean>(false);

  const [fullName, setFullName] = useState("");
  const [actives, setActives] = useState(new Set<boolean>());
  const [countries, setCountries] = useState(new Set<string>()); // values chosen before the apply button
  const [states, setStates] = useState(new Set<string>());
  const [cities, setCities] = useState(new Set<string>());
  const [dateOfBirths, setDateOfBirths] = useState(new Set<string>());
  const [emails, setEmails] = useState(new Set<string>());
  const [additionalAffiliations, setAdditionalAffiliations] = useState(
    new Set<string>()
  );
  const [dateOfJoins, setDateOfJoins] = useState(new Set<string>());
  const [beiChapters, setBeiChapters] = useState(new Set<string>());
  const [secondaryPhoneNumbers, setSecondaryPhoneNumbers] = useState(
    new Set<string>()
  );
  const [secondaryNames, setSecondaryNames] = useState(new Set<string>());

  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<ITableEntry[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [numRecords, setNumRecords] = useState(0);

  useEffect(() => {
    getAuth().onAuthStateChanged((user) => {
      if (user) {
        internalRequest<FilteredUsersResponse>({
          url: "/api/patient/filter-patient",
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
              actives: Array.from(actives),
              countries: Array.from(countries),
              states: Array.from(states),
              cities: Array.from(cities),
              dateOfJoins: Array.from(dateOfJoins),
            },
            page: currentPage,
            sortParams: sortField,
          },
        }).then((res) => {
          setPageCount(res?.numPages);
          setNumRecords(res?.numRecords);
          setFilteredUsers(res?.data ?? []);
        });
      }
    });
  }, [
    fullName,
    actives,
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

  const viewTablePermanent = useCallback(() => setViewTable(true), []);

  return (
    <div className={styles.container}>
      <div
        className={classes(
          styles["search-container"],
          !viewTable && styles["search-container-alone"]
        )}
      >
        <p className={styles["intro-text"]}>
          To begin viewing analytics, search for a patient here!
        </p>
        <div className={styles["search-wrapper"]}>
          <Search
            setFullName={setFullName}
            actives={actives}
            setActives={setActives}
            countries={countries}
            setCountries={setCountries}
            states={states}
            setStates={setStates}
            cities={cities}
            setCities={setCities}
            dateOfBirths={dateOfBirths}
            setDateOfBirths={setDateOfBirths}
            emails={emails}
            setEmails={setEmails}
            additionalAffiliations={additionalAffiliations}
            setAdditionalAffiliations={setAdditionalAffiliations}
            dateOfJoins={dateOfJoins}
            setDateOfJoins={setDateOfJoins}
            beiChapters={beiChapters}
            setBeiChapters={setBeiChapters}
            secondaryPhoneNumbers={secondaryPhoneNumbers}
            setSecondaryPhoneNumbers={setSecondaryPhoneNumbers}
            secondaryNames={secondaryNames}
            setSecondaryNames={setSecondaryNames}
            onSubmit={viewTablePermanent}
          />
        </div>
      </div>
      <div
        className={classes(
          styles["table-container"],
          viewTable && styles["table-container-show"]
        )}
      >
        <div className={styles["table-header"]}>
          <Dashboard />
          <p className={styles["table-header-text"]}>Patient Table</p>
        </div>
        <PatientGrid
          data={filteredUsers}
          sortField={sortField}
          setSortField={setSortField}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
          numRecords={numRecords}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
