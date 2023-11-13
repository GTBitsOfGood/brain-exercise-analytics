"use client";

import React, { useCallback, useMemo, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { classes, transformDate, transformPhoneNumber } from "@src/utils/utils";
import styles from "./Search.module.css";
import Tag from "./Tag/Tag";
import { AdvancedSearch } from "./AdvancedSearch/AdvancedSearch";
import InputField from "../InputField/InputField";

interface SearchProps {
  className?: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  actives: Set<boolean>;
  setActives: React.Dispatch<React.SetStateAction<Set<boolean>>>;
  countries: Set<string>;
  setCountries: React.Dispatch<React.SetStateAction<Set<string>>>;
  states: Set<string>;
  setStates: React.Dispatch<React.SetStateAction<Set<string>>>;
  cities: Set<string>;
  setCities: React.Dispatch<React.SetStateAction<Set<string>>>;
  dateOfBirths: Set<string>;
  setDateOfBirths: React.Dispatch<React.SetStateAction<Set<string>>>;
  emails: Set<string>;
  setEmails: React.Dispatch<React.SetStateAction<Set<string>>>;
  additionalAffiliations: Set<string>;
  setAdditionalAffiliations: React.Dispatch<React.SetStateAction<Set<string>>>;
  joinDates: Set<string>;
  setJoinDates: React.Dispatch<React.SetStateAction<Set<string>>>;
  beiChapters: Set<string>;
  setBeiChapters: React.Dispatch<React.SetStateAction<Set<string>>>;
  secondaryPhoneNumbers: Set<string>;
  setSecondaryPhoneNumbers: React.Dispatch<React.SetStateAction<Set<string>>>;
  secondaryNames: Set<string>;
  setSecondaryNames: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function Search({
  className,
  setFullName,
  actives,
  setActives,
  countries,
  setCountries,
  states,
  setStates,
  cities,
  setCities,
  dateOfBirths,
  setDateOfBirths,
  emails,
  setEmails,
  additionalAffiliations,
  setAdditionalAffiliations,
  joinDates,
  setJoinDates,
  beiChapters,
  setBeiChapters,
  secondaryPhoneNumbers,
  setSecondaryPhoneNumbers,
  secondaryNames,
  setSecondaryNames,
}: SearchProps) {
  const [searchInput, setSearchInput] = useState<string>("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

  const tagsPresent = useMemo(
    () =>
      actives.size > 0 ||
      countries.size > 0 ||
      states.size > 0 ||
      cities.size > 0 ||
      dateOfBirths.size > 0 ||
      emails.size > 0 ||
      additionalAffiliations.size > 0 ||
      joinDates.size > 0 ||
      beiChapters.size > 0 ||
      secondaryPhoneNumbers.size > 0 ||
      secondaryNames.size > 0,
    [
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
    ],
  );

  const updateFullName = useCallback(() => {
    setFullName(searchInput);
  }, [searchInput, setFullName]);

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
            onClick={updateFullName}
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
                  list={countries}
                  setList={setCountries}
                />
              ))}
            {states.size > 0 &&
              Array.from(states).map((state) => (
                <Tag
                  key={`state-${state}`}
                  title="State"
                  value={state}
                  list={states}
                  setList={setStates}
                />
              ))}
            {cities.size > 0 &&
              Array.from(cities).map((city) => (
                <Tag
                  key={`city-${city}`}
                  title="City"
                  value={city}
                  list={cities}
                  setList={setCities}
                />
              ))}
            {actives.size > 0 &&
              Array.from(actives).map((active) => (
                <Tag
                  key={`active-${active}`}
                  title="Status"
                  value={active}
                  list={actives}
                  setList={setActives}
                  transformData={(val) => (val ? "Active" : "Inactive")}
                />
              ))}
            {dateOfBirths.size > 0 &&
              Array.from(dateOfBirths).map((dob) => (
                <Tag
                  key={`dob-${dob}`}
                  title="Date of Birth"
                  value={dob}
                  list={dateOfBirths}
                  setList={setDateOfBirths}
                  transformData={transformDate}
                />
              ))}
            {emails.size > 0 &&
              Array.from(emails).map((email) => (
                <Tag
                  key={`email-${email}`}
                  title="Email"
                  value={email}
                  list={emails}
                  setList={setEmails}
                />
              ))}
            {joinDates.size > 0 &&
              Array.from(joinDates).map((joinDate) => (
                <Tag
                  key={`join-date-${joinDate}`}
                  title="Join Date"
                  value={joinDate}
                  list={joinDates}
                  setList={setJoinDates}
                  transformData={transformDate}
                />
              ))}
            {beiChapters.size > 0 &&
              Array.from(beiChapters).map((chapter) => (
                <Tag
                  key={`bei-chapter-${chapter}`}
                  title="BEI Chapter"
                  value={chapter}
                  list={beiChapters}
                  setList={setBeiChapters}
                />
              ))}
            {secondaryPhoneNumbers.size > 0 &&
              Array.from(secondaryPhoneNumbers).map((secondaryPhoneNumber) => (
                <Tag
                  key={`phone-number-${secondaryPhoneNumber}`}
                  title="Secondary Phone Number"
                  value={secondaryPhoneNumber}
                  list={secondaryPhoneNumbers}
                  setList={setSecondaryPhoneNumbers}
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
                    list={additionalAffiliations}
                    setList={setAdditionalAffiliations}
                  />
                ),
              )}
            {secondaryNames.size > 0 &&
              Array.from(secondaryNames).map((secondaryName) => (
                <Tag
                  key={`secondary-name-${secondaryName}`}
                  title="Secondary Name"
                  value={secondaryName}
                  list={secondaryNames}
                  setList={setSecondaryNames}
                />
              ))}
          </div>
        ) : null}
      </div>
      <AdvancedSearch
        setActives={setActives}
        setCountries={setCountries}
        setStates={setStates}
        setCities={setCities}
        setDateOfBirths={setDateOfBirths}
        setEmails={setEmails}
        setAdditionalAffiliations={setAdditionalAffiliations}
        setJoinDates={setJoinDates}
        setBeiChapters={setBeiChapters}
        setSecondaryPhoneNumbers={setSecondaryPhoneNumbers}
        setSecondaryNames={setSecondaryNames}
        style={{
          maxHeight: showAdvancedSearch ? "10000px" : "0px",
          zIndex: showAdvancedSearch ? 3 : -1,
          opacity: showAdvancedSearch ? 1 : 0,
        }}
        onClick={updateFullName}
      />
    </div>
  );
}
