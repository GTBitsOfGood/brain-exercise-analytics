"use client";

import React, { useCallback, useMemo, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { classes, transformDate, transformPhoneNumber } from "@src/utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import {
  setFullName,
  setActive,
  setCountries,
  setStates,
  setCities,
  setDateOfBirths,
  setEmails,
  setAdditionalAffiliations,
  setDateOfJoins,
  setBeiChapters,
  setSecondaryPhoneNumbers,
  setSecondaryNames,
} from "@src/redux/reducers/patientSearchReducer";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import styles from "./Search.module.css";
import Tag from "./Tag/Tag";
import { AdvancedSearch } from "./AdvancedSearch/AdvancedSearch";
import InputField from "../InputField/InputField";

interface SearchProps {
  className?: string;
  onSubmit?: () => void;
}

export default function Search({ className, onSubmit }: SearchProps) {
  const dispatch = useDispatch();

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

  const [searchInput, setSearchInput] = useState<string>(fullName);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

  const tagsPresent = useMemo(
    () =>
      active !== undefined ||
      countries.size > 0 ||
      states.size > 0 ||
      cities.size > 0 ||
      dateOfBirths.size > 0 ||
      emails.size > 0 ||
      additionalAffiliations.size > 0 ||
      dateOfJoins.size > 0 ||
      beiChapters.size > 0 ||
      secondaryPhoneNumbers.size > 0 ||
      secondaryNames.size > 0,
    [
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
    ],
  );

  const onSubmitSearch = useCallback(() => {
    dispatch(setFullName(searchInput));

    onSubmit?.();
  }, [searchInput, dispatch, onSubmit]);

  const curryOnCloseSetTag = useCallback(
    <T,>(set: Set<T>, action: ActionCreatorWithPayload<Set<T>, string>) => {
      return (value: T) => {
        const updatedSet = new Set<T>(set);
        updatedSet.delete(value);
        dispatch(action(updatedSet));
      };
    },
    [dispatch],
  );

  return (
    <div className={classes(styles.wrapper, className)}>
      <div className={styles.border}>
        <div className={styles["search-no-tags"]}>
          <div className={styles["search-container"]}>
            <InputField
              className={styles["search-bar"]}
              inputFieldClassName={styles["search-bar-input"]}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Name"
            />
          </div>
          <FontAwesomeIcon
            className={styles["search-icon"]}
            icon={faSearch}
            size="lg"
            onClick={onSubmitSearch}
            style={{ height: 28 }}
          />
          <p
            className={styles["advanced-filter"]}
            onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
          >
            Advanced Filter
          </p>
        </div>
        {tagsPresent ? (
          <div className={styles.tags}>
            {countries.size > 0 &&
              Array.from(countries).map((country) => (
                <Tag
                  key={`country-${country}`}
                  title="Country"
                  value={country}
                  handleClose={curryOnCloseSetTag(countries, setCountries)}
                />
              ))}
            {states.size > 0 &&
              Array.from(states).map((state) => (
                <Tag
                  key={`state-${state}`}
                  title="State"
                  value={state}
                  handleClose={curryOnCloseSetTag(states, setStates)}
                />
              ))}
            {cities.size > 0 &&
              Array.from(cities).map((city) => (
                <Tag
                  key={`city-${city}`}
                  title="City"
                  value={city}
                  handleClose={curryOnCloseSetTag(cities, setCities)}
                />
              ))}
            {active !== undefined && (
              <Tag
                key={`active-${active}`}
                title="Status"
                value={String(active)}
                transformData={() => (active ? "Active" : "Inactive")}
                onClick={() => {
                  dispatch(setActive(undefined));
                }}
              />
            )}
            {dateOfBirths.size > 0 &&
              Array.from(dateOfBirths).map((dob) => (
                <Tag
                  key={`dob-${dob}`}
                  title="Date of Birth"
                  value={dob}
                  handleClose={curryOnCloseSetTag(
                    dateOfBirths,
                    setDateOfBirths,
                  )}
                  transformData={transformDate}
                />
              ))}
            {emails.size > 0 &&
              Array.from(emails).map((email) => (
                <Tag
                  key={`email-${email}`}
                  title="Email"
                  value={email}
                  handleClose={curryOnCloseSetTag(emails, setEmails)}
                />
              ))}
            {dateOfJoins.size > 0 &&
              Array.from(dateOfJoins).map((dateOfJoin) => (
                <Tag
                  key={`join-date-${dateOfJoin}`}
                  title="Join Date"
                  value={dateOfJoin}
                  handleClose={curryOnCloseSetTag(dateOfJoins, setDateOfJoins)}
                  transformData={transformDate}
                />
              ))}
            {beiChapters.size > 0 &&
              Array.from(beiChapters).map((chapter) => (
                <Tag
                  key={`bei-chapter-${chapter}`}
                  title="BEI Chapter"
                  value={chapter}
                  handleClose={curryOnCloseSetTag(beiChapters, setBeiChapters)}
                />
              ))}
            {secondaryPhoneNumbers.size > 0 &&
              Array.from(secondaryPhoneNumbers).map((secondaryPhoneNumber) => (
                <Tag
                  key={`phone-number-${secondaryPhoneNumber}`}
                  title="Secondary Phone Number"
                  value={secondaryPhoneNumber}
                  handleClose={curryOnCloseSetTag(
                    secondaryPhoneNumbers,
                    setSecondaryPhoneNumbers,
                  )}
                  transformData={transformPhoneNumber}
                />
              ))}
            {additionalAffiliations.size > 0 &&
              Array.from(additionalAffiliations).map(
                (additionalAffiliation) => (
                  <Tag
                    key={`additional-affiliation-${additionalAffiliation}`}
                    title="Additional Affiliation"
                    value={additionalAffiliation}
                    handleClose={curryOnCloseSetTag(
                      additionalAffiliations,
                      setAdditionalAffiliations,
                    )}
                  />
                ),
              )}
            {secondaryNames.size > 0 &&
              Array.from(secondaryNames).map((secondaryName) => (
                <Tag
                  key={`secondary-name-${secondaryName}`}
                  title="Secondary Name"
                  value={secondaryName}
                  handleClose={curryOnCloseSetTag(
                    secondaryNames,
                    setSecondaryNames,
                  )}
                />
              ))}
          </div>
        ) : null}
        <div
          className={classes(
            styles["advanced-search-container"],
            showAdvancedSearch && styles["advanced-search-container-show"],
          )}
        >
          <AdvancedSearch onSubmit={onSubmitSearch} />
        </div>
      </div>
    </div>
  );
}
