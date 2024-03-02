import React, { useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import { IPatientSearchReducer } from "@/common_utils/types";
import { setActive } from "@src/redux/reducers/patientSearchReducer";
import styles from "./Tag.module.css";

type TagProps = {
  title: string;
  value: string;
  category: keyof IPatientSearchReducer;
  setAction?: ActionCreatorWithPayload<Set<string>, string>;
  transformData?: (value: string) => string;
  onClick?: () => void;
};

export default function Tag({
  title,
  value,
  category,
  setAction,
  onClick,
  transformData,
}: TagProps) {
  const [closeTag, setCloseTag] = useState(false);
  const dispatch = useDispatch();
  const categorySet = useSelector(
    (state: RootState) => state.patientSearch[category],
  );

  const handleCloseTag = () => {
    setCloseTag(true);
    if (!(categorySet instanceof Set)) {
      return;
    }
    const updatedSet = new Set(categorySet);
    updatedSet.delete(value);
    if (setAction) {
      dispatch(setAction(updatedSet));
    }
    if (onClick) {
      onClick();
    }
  };

  const tagText = transformData
    ? `${title}: ${transformData(value)}`
    : `${title}: ${value}`;

  if (closeTag) {
    dispatch(setActive(undefined));
    return null;
  }

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
