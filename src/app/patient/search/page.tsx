"use client";

import { useCallback, useMemo, useState } from "react";
import { Dashboard } from "@mui/icons-material";
import Search from "@src/components/Search/Search";

import PatientGrid from "@src/components/PatientGrid/PatientGrid";
import { sampleUsers } from "@src/utils/patients";
import { classes, transformDate } from "@src/utils/utils";
import { SortField } from "@src/utils/types";
import styles from "./page.module.css";

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
    new Set<string>(),
  );
  const [joinDates, setJoinDates] = useState(new Set<string>());
  const [beiChapters, setBeiChapters] = useState(new Set<string>());
  const [secondaryPhoneNumbers, setSecondaryPhoneNumbers] = useState(
    new Set<string>(),
  );
  const [secondaryNames, setSecondaryNames] = useState(new Set<string>());

  const [sortField, setSortField] = useState<SortField>(undefined);

  const filteredUsers = useMemo(() => {
    return sampleUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(fullName.toLowerCase()) &&
        (actives.size === 0 || actives.has(user.status)) &&
        (countries.size === 0 || countries.has(user.location.country)) &&
        (states.size === 0 || states.has(user.location.state)) &&
        (cities.size === 0 || cities.has(user.location.city)) &&
        (dateOfBirths.size === 0 ||
          dateOfBirths.has(transformDate(user.patientDetails.birthDate))) &&
        (emails.size === 0 || emails.has(user.email)) &&
        (additionalAffiliations.size === 0 ||
          additionalAffiliations.has(
            user.patientDetails.additionalAffiliation,
          )) &&
        (joinDates.size === 0 ||
          joinDates.has(transformDate(user.startDate))) &&
        (beiChapters.size === 0 || beiChapters.has(user.chapter)) &&
        (secondaryPhoneNumbers.size === 0 ||
          secondaryPhoneNumbers.has(
            user.patientDetails.secondaryContactPhone,
          )) &&
        (secondaryNames.size === 0 ||
          secondaryNames.has(user.patientDetails.secondaryContactName))
      );
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
    joinDates,
    beiChapters,
    secondaryPhoneNumbers,
    secondaryNames,
  ]);

  const viewTablePermanent = useCallback(() => setViewTable(true), []);

  return (
    <div className={styles.container}>
      <div
        className={classes(
          styles["search-container"],
          !viewTable && styles["search-container-alone"],
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
            joinDates={joinDates}
            setJoinDates={setJoinDates}
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
          viewTable && styles["table-container-show"],
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
        />
      </div>
    </div>
  );
}
