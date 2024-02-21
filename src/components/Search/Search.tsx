"use client";

import React, { useCallback, useMemo, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import SearchIcon from "@mui/icons-material/Search";

import { classes, transformDate, transformPhoneNumber } from "@src/utils/utils";
import styles from "./Search.module.css";
import Tag from "./Tag/Tag";
import { AdvancedSearch } from "./AdvancedSearch/AdvancedSearch";
import InputField from "../InputField/InputField";

interface SearchProps {
  className?: string;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  active: boolean | undefined;
  setActive: React.Dispatch<React.SetStateAction<boolean | undefined>>;
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
  dateOfJoins: Set<string>;
  setDateOfJoins: React.Dispatch<React.SetStateAction<Set<string>>>;
  beiChapters: Set<string>;
  setBeiChapters: React.Dispatch<React.SetStateAction<Set<string>>>;
  secondaryPhoneNumbers: Set<string>;
  setSecondaryPhoneNumbers: React.Dispatch<React.SetStateAction<Set<string>>>;
  secondaryNames: Set<string>;
  setSecondaryNames: React.Dispatch<React.SetStateAction<Set<string>>>;
  onSubmit?: () => void;
}

export default function Search({
  className,
  setFullName,
  active,
  setActive,
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
  dateOfJoins,
  setDateOfJoins,
  beiChapters,
  setBeiChapters,
  secondaryPhoneNumbers,
  setSecondaryPhoneNumbers,
  secondaryNames,
  setSecondaryNames,
  onSubmit,
}: SearchProps) {
  const [searchInput, setSearchInput] = useState<string>("");
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
    ]
  );

  const onSubmitSearch = useCallback(() => {
    setFullName(searchInput);
    onSubmit?.();
  }, [searchInput, setFullName, onSubmit]);

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
              placeholder="Search"
              icon={<SearchIcon fontSize="medium" />}
            />
          </div>
          <FontAwesomeIcon
            className={styles["search-icon"]}
            icon={faSearch}
            size="lg"
            onClick={onSubmitSearch}
            style={{ height: 28 }}
          />

          <div className={styles["advanced-filter"]}>
            {!showAdvancedSearch ? (
              <FilterAltIcon
                fontSize="large"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              />
            ) : (
              <FilterAltOffIcon
                fontSize="large"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              />
            )}
          </div>
        </div>
        {tagsPresent ? (
          <div className={styles.tags}>
            {countries.size > 0 &&
              Array.from(countries).map((country) => (
                <Tag
                  key={`country-${country}`}
                  title="Country"
                  value={country}
                  setList={setCountries}
                />
              ))}
            {states.size > 0 &&
              Array.from(states).map((state) => (
                <Tag
                  key={`state-${state}`}
                  title="State"
                  value={state}
                  setList={setStates}
                />
              ))}
            {cities.size > 0 &&
              Array.from(cities).map((city) => (
                <Tag
                  key={`city-${city}`}
                  title="City"
                  value={city}
                  setList={setCities}
                />
              ))}
            {active !== undefined && (
              <Tag
                key={`active-${active}`}
                title="Status"
                value={active}
                transformData={(val) => (val ? "Active" : "Inactive")}
                onClick={() => setActive(undefined)}
              />
            )}
            {dateOfBirths.size > 0 &&
              Array.from(dateOfBirths).map((dob) => (
                <Tag
                  key={`dob-${dob}`}
                  title="Date of Birth"
                  value={dob}
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
                  setList={setEmails}
                />
              ))}
            {dateOfJoins.size > 0 &&
              Array.from(dateOfJoins).map((dateOfJoin) => (
                <Tag
                  key={`join-date-${dateOfJoin}`}
                  title="Join Date"
                  value={dateOfJoin}
                  setList={setDateOfJoins}
                  transformData={transformDate}
                />
              ))}
            {beiChapters.size > 0 &&
              Array.from(beiChapters).map((chapter) => (
                <Tag
                  key={`bei-chapter-${chapter}`}
                  title="BEI Chapter"
                  value={chapter}
                  setList={setBeiChapters}
                />
              ))}
            {secondaryPhoneNumbers.size > 0 &&
              Array.from(secondaryPhoneNumbers).map((secondaryPhoneNumber) => (
                <Tag
                  key={`phone-number-${secondaryPhoneNumber}`}
                  title="Secondary Phone Number"
                  value={secondaryPhoneNumber}
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
                    setList={setAdditionalAffiliations}
                  />
                )
              )}
            {secondaryNames.size > 0 &&
              Array.from(secondaryNames).map((secondaryName) => (
                <Tag
                  key={`secondary-name-${secondaryName}`}
                  title="Secondary Name"
                  value={secondaryName}
                  setList={setSecondaryNames}
                />
              ))}
          </div>
        ) : null}
        <div
          className={classes(
            styles["advanced-search-container"],
            showAdvancedSearch && styles["advanced-search-container-show"]
          )}
        >
          <AdvancedSearch
            active={active}
            setActive={setActive}
            setCountries={setCountries}
            setStates={setStates}
            setCities={setCities}
            setDateOfBirths={setDateOfBirths}
            setEmails={setEmails}
            setAdditionalAffiliations={setAdditionalAffiliations}
            setDateOfJoins={setDateOfJoins}
            setBeiChapters={setBeiChapters}
            setSecondaryPhoneNumbers={setSecondaryPhoneNumbers}
            setSecondaryNames={setSecondaryNames}
            onSubmit={onSubmitSearch}
          />
        </div>
      </div>
    </div>
  );
}
