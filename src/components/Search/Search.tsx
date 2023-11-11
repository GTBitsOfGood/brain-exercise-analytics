"use client";

import React, { useMemo, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { classes } from "@src/utils/utils";
import styles from "./Search.module.css";
import Tag from "./Tag/Tag";
import { AdvancedSearch } from "./AdvancedSearch/AdvancedSearch";
import InputField from "../InputField/InputField";

interface SearchProps {
  className?: string;
}

export default function Search({ className }: SearchProps) {
  const [searchInput, setSearchInput] = useState("");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

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
            onClick={() => console.log(searchInput)} //eslint-disable-line
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
      />
    </div>
  );
}
