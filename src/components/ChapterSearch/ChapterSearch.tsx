"use client";

import React, {
  FormEvent,
  MouseEvent,
  useCallback,
  useState,
  useEffect,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";

import { update, clear } from "@src/redux/reducers/chapterSearchReducer";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classes } from "@src/utils/utils";
import styles from "./ChapterSearch.module.css";
import InputField from "../InputField/InputField";

interface SearchProps {
  className?: string;
  onSubmit?: () => void;
}

export default function ChapterSearch({ className, onSubmit }: SearchProps) {
  const dispatch = useDispatch();

  const { name } = useSelector((state: RootState) => state.chapterSearch);

  const [searchInput, setSearchInput] = useState<string>(name);

  useEffect(() => {
    dispatch(clear());
    setSearchInput("");
  }, []);

  const onSubmitSearch = useCallback(
    (e?: FormEvent<HTMLFormElement> | MouseEvent<SVGSVGElement>) => {
      if (e) {
        e.preventDefault();
      }
      dispatch(update({ name: searchInput }));
      onSubmit?.();
    },
    [searchInput, onSubmit, dispatch],
  );

  return (
    <div className={classes(styles.wrapper, className)}>
      <div className={[styles.border].join(" ")}>
        <div className={styles["search-no-tags"]}>
          <form
            className={styles["search-container"]}
            onSubmit={onSubmitSearch}
          >
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
          </form>
        </div>
      </div>
    </div>
  );
}
