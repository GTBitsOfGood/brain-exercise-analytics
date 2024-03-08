"use client";

import React, { useEffect, useState } from "react";
import Search from "@src/components/Search/Search";

import { classes } from "@src/utils/utils";
import { internalRequest } from "@src/utils/requests";
import {
  // SortField,
  HttpMethod,
  IVolunteerTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";

import { getAuth } from "firebase/auth";
import firebaseInit from "@src/firebase/config";

import VolunteerGrid from "@src/components/VolunteerGrid/VolunteerGrid";
import styles from "./page.module.css";

firebaseInit();

export default function Page() {
  // Adding the following eslint-disable because we changed the way the Search component works.
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [fullName, setFullName] = useState("");
  const [active, setActive] = useState<boolean | undefined>(undefined);
  const [countries, setCountries] = useState(new Set<string>()); // values chosen before the apply button
  const [states, setStates] = useState(new Set<string>());
  const [cities, setCities] = useState(new Set<string>());
  const [dateOfBirths, setDateOfBirths] = useState(new Set<string>());
  const [emails, setEmails] = useState(new Set<string>());
  const [additionalAffiliations, setAdditionalAffiliations] = useState(
    new Set<string>(),
  );
  const [dateOfJoins, setDateOfJoins] = useState(new Set<string>());
  const [beiChapters, setBeiChapters] = useState(new Set<string>());
  const [secondaryPhoneNumbers, setSecondaryPhoneNumbers] = useState(
    new Set<string>(),
  );
  const [secondaryNames, setSecondaryNames] = useState(new Set<string>());
  /* eslint-enable @typescript-eslint/no-unused-vars */

  // const [sortField, setSortField] = useState<SortField | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(0);
  // const [pageCount, setPageCount] = useState(0);

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
            },
            page: currentPage,
            // sortParams: sortField,
          },
          // }).then((res) => {
          // setPageCount(res?.numPages ?? 0);
          // setFilteredUsers(res?.data ?? []);
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
    // sortField,
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
    // sortField,
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              d="M25.6975 30.571C25.8205 30.7596 25.8903 30.9779 25.8994 31.2029C25.9086 31.4279 25.8568 31.6511 25.7496 31.8491C25.6424 32.0471 25.4836 32.2125 25.2902 32.3277C25.0968 32.4429 24.8758 32.5038 24.6506 32.5038H1.5975C1.37234 32.5038 1.15137 32.4429 0.957925 32.3277C0.764485 32.2125 0.605762 32.0471 0.498526 31.8491C0.39129 31.6511 0.339523 31.4279 0.348694 31.2029C0.357865 30.9779 0.427634 30.7596 0.550629 30.571C2.31017 27.8626 4.89827 25.7957 7.92875 24.6788C6.25344 23.5635 4.98152 21.9386 4.30109 20.0445C3.62067 18.1504 3.56785 16.0876 4.15046 14.1612C4.73307 12.2347 5.92016 10.5469 7.53621 9.34729C9.15225 8.14769 11.1114 7.5 13.1241 7.5C15.1367 7.5 17.0959 8.14769 18.7119 9.34729C20.328 10.5469 21.5151 12.2347 22.0977 14.1612C22.6803 16.0876 22.6275 18.1504 21.947 20.0445C21.2666 21.9386 19.9947 23.5635 18.3194 24.6788C21.3499 25.7957 23.938 27.8626 25.6975 30.571ZM39.4334 30.5476C37.6734 27.8506 35.0911 25.7926 32.0694 24.6788C34.0472 23.3465 35.4429 21.3107 35.9726 18.9856C36.5022 16.6605 36.126 14.221 34.9203 12.1635C33.7147 10.1061 31.7704 8.58543 29.4831 7.91104C27.1958 7.23665 24.7374 7.45923 22.6084 8.53349C22.527 8.57553 22.4559 8.63494 22.4 8.70754C22.3441 8.78013 22.3048 8.86413 22.285 8.95358C22.2652 9.04302 22.2652 9.13574 22.2852 9.22515C22.3052 9.31457 22.3446 9.39849 22.4006 9.47099C23.9837 11.4457 24.8929 13.8754 24.9949 16.4043C25.097 18.9332 24.3866 21.4283 22.9678 23.5241C22.8761 23.6611 22.8422 23.8287 22.8735 23.9906C22.9049 24.1524 22.9988 24.2953 23.135 24.3882C24.9848 25.6792 26.5684 27.3148 27.7991 29.2054C28.2954 29.9655 28.4981 30.8802 28.3694 31.7788C28.3549 31.8682 28.36 31.9597 28.3843 32.0469C28.4087 32.1341 28.4517 32.215 28.5104 32.2839C28.5691 32.3529 28.6421 32.4083 28.7243 32.4462C28.8065 32.4842 28.896 32.5038 28.9866 32.5038H38.4084C38.6837 32.5039 38.9513 32.4131 39.1697 32.2456C39.388 32.078 39.545 31.8431 39.6163 31.5772C39.6597 31.4024 39.6659 31.2203 39.6344 31.0429C39.6029 30.8655 39.5344 30.6968 39.4334 30.5476Z"
              fill="#9CA5C2"
            />
          </svg>
          <p className={styles["table-header-text"]}>Volunteer List</p>
        </div>
        <VolunteerGrid data={[]} />
      </div>
    </div>
  );
}
