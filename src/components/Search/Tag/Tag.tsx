import React, { Dispatch, SetStateAction, useState } from 'react';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './Tag.module.css';
import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@src/redux/rootReducer';
import { IPatientSearchReducer } from '@/common_utils/types';

type TagProps<T> = {
  title: string;
  value: string;
  category: keyof IPatientSearchReducer;
  setAction: ActionCreatorWithPayload<Set<string>, string>;
  transformData?: (value: string) => string;
};

export default function Tag<T>({
  title,
  value,
  category,
  setAction,
  transformData,
}: TagProps<T>) {
  const dispatch = useDispatch();
  const categorySet = useSelector(
    (state: RootState) => state.patientSearch[category]
  );

  const handleCloseTag = () => {
    // condition to check if categorySet is a set
    if (!(categorySet instanceof Set)) {
      return;
    }
    const updatedSet = new Set(categorySet);
    updatedSet.delete(value);
    dispatch(setAction(updatedSet));
  };

  const tagText = transformData
    ? `${title}: ${transformData(value)}`
    : `${title}: ${value}`;

  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <span className={styles.text}>{tagText}</span>
        <div className={styles['icon-container']} onClick={handleCloseTag}>
          <FontAwesomeIcon className={styles['x-icon']} icon={faX} size='2xs' />
        </div>
      </div>
    </div>
  );
}
