"use client";

import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";

import { setFullName } from "@src/redux/reducers/volunteerSearchReducer";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { classes } from "@src/utils/utils";
import styles from "./VolunteerSearch.module.css";
import { VolunteerAdvancedSearch } from "./VolunteerAdvancedSearch/VolunteerAdvancedSearch";
import InputField from "../InputField/InputField";

interface SearchProps {
  className?: string;
  onSubmit?: () => void;
}

export default function VolunteerSearch({ className, onSubmit }: SearchProps) {
  const dispatch = useDispatch();

  const { fullName } = useSelector((state: RootState) => state.volunteerSearch);

  const [searchInput, setSearchInput] = useState<string>(fullName);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState<boolean>(false);

  const onSubmitSearch = useCallback(() => {
    if (showAdvancedSearch) {
      setShowAdvancedSearch(!showAdvancedSearch);
    }
    dispatch(setFullName(searchInput));
    onSubmit?.();
  }, [searchInput, showAdvancedSearch, onSubmit, dispatch]);

  return (
    <div className={classes(styles.wrapper, className)}>
      <div
        className={[
          styles.border,
          showAdvancedSearch && styles["border-change"],
        ].join(" ")}
      >
        <div className={styles["search-no-tags"]}>
          <div className={styles["search-container"]}>
            <FontAwesomeIcon
              className={styles["search-icon"]}
              icon={faSearch}
              size="sm"
              onClick={onSubmitSearch}
              style={{ height: 20 }}
            />
            <InputField
              className={styles["search-bar"]}
              inputFieldClassName={styles["search-bar-input"]}
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
              }}
              placeholder="Search"
            />
          </div>

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

        <div
          className={classes(
            styles["advanced-search-container"],
            showAdvancedSearch && styles["advanced-search-container-show"],
          )}
        >
          <VolunteerAdvancedSearch />
        </div>
      </div>
    </div>
  );
}
