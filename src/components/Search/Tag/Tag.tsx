import React from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import { IPatientSearchReducer } from "@/common_utils/types";
import styles from "./Tag.module.css";

type TagProps<T> = {
  title: string;
  value: string;
  category: keyof IPatientSearchReducer;
  setAction: ActionCreatorWithPayload<Set<string>, string>;
  transformData?: (value: string) => string;
  onClick?: () => void;
};

export default function Tag<T>({
  title,
  value,
  category,
  setAction,
  onClick,
  transformData,
}: TagProps<T>) {
  const dispatch = useDispatch();
  const categorySet = useSelector(
    (state: RootState) => state.patientSearch[category],
  );

  const handleCloseTag = () => {
    if (!(categorySet instanceof Set)) {
      return;
    }
    const updatedSet = new Set(categorySet);
    updatedSet.delete(value);
    dispatch(setAction(updatedSet));
    if (onClick) {
      onClick();
    }
  };

  const tagText = transformData
    ? `${title}: ${transformData(value)}`
    : `${title}: ${value}`;

  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <span className={styles.text}>{tagText}</span>
        <div className={styles["icon-container"]} onClick={handleCloseTag}>
          <FontAwesomeIcon className={styles["x-icon"]} icon={faX} size="2xs" />
        </div>
      </div>
    </div>
  );
}
