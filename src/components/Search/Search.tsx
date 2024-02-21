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
            // hihihihihi
            countries={countries}
            states={states}
            cities={cities}
            dateOfBirths={dateOfBirths}
            emails={emails}
            additionalAffiliations={additionalAffiliations}
            dateOfJoins={dateOfJoins}
            beiChapters={beiChapters}
            secondaryPhoneNumbers={secondaryPhoneNumbers}
            secondaryNames={secondaryNames}
          />
        </div>
      </div>
    </div>
  );
}
