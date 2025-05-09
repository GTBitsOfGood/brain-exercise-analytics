"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretRight,
  faCircleCheck,
  faCircleXmark,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

import { classes, transformPhoneNumber } from "@src/utils/utils";
import { useCallback, useState } from "react";
import Link from "next/link";
import styles from "./Row.module.css";
import { GridRowDef } from "../types";

function ExpandedRow({ row }: { row: GridRowDef }) {
  return (
    <tr>
      <td colSpan={8}>
        <div className={styles.ExpandedRowContainer}>
          <div className={styles.ExpandedRowColumn}>
            <div className={styles.Header}>
              Patient&apos;s Additional Information
            </div>
            <div className={styles.Detail}>
              <span className={styles.Label}>
                <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; Date of Joined
              </span>
              <span className={styles.Content}>{row.dateStart}</span>
            </div>
            <div className={styles.Detail}>
              <span className={styles.Label}>
                <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; Additional
                Affiliation
              </span>
              <span className={styles.Content}>
                {row.additionalAffiliation}
              </span>
            </div>
          </div>

          <div className={styles.ExpandedRowColumn}>
            <div className={styles.Header}>Secondary Contact Person</div>
            <div className={styles.Detail}>
              <span className={styles.Label}>
                <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; Name
              </span>
              <span className={styles.Content}>{row.secondContactName}</span>
            </div>
            <div className={styles.Detail}>
              <span className={styles.Label}>
                <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; Contact
              </span>
              <span className={styles.Content}>
                {transformPhoneNumber(row.secondContactPhone)}
              </span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function Row({ row }: { row: GridRowDef }) {
  const [view, setView] = useState<boolean>(false);
  const handleClick = useCallback(() => setView((v) => !v), []);

  return (
    <>
      <tr className={styles.Row}>
        <td className={styles.RowCell}>
          <button
            className={styles.caret}
            style={{
              rotate: view ? "90deg" : "0deg",
              translate: view ? "0 -20%" : "0 0",
              scale: 1.15,
            }}
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>
            <p className={styles.RowCellText} onClick={handleClick}>
              {row.firstName}
            </p>
          </div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>
            <p className={styles.RowCellText} onClick={handleClick}>
              {row.lastName}
            </p>
          </div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>{row.dateOfBirth}</div>
        </td>
        <td className={styles.RowCell}>
          <div
            className={classes(styles.RowCellContainer, styles.StatusContainer)}
          >
            {!row.active && (
              <FontAwesomeIcon icon={faCircleXmark} color="#ff004c" />
            )}
            {row.active && (
              <FontAwesomeIcon icon={faCircleCheck} color="#05cd99" />
            )}
          </div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>{row.email}</div>
        </td>
        <td className={styles.RowCell}>
          <div
            className={`${styles.RowCellContainer} ${styles.ChapterCellContainer}`}
          >
            {row.chapter}
          </div>
        </td>
        <td className={styles.RowCell}>
          <Link
            className={styles.DatabaseButton}
            href={`/patient/analytics/${row.id}`}
          >
            View Analytics
          </Link>
        </td>
      </tr>
      {view && <ExpandedRow row={row} />}
    </>
  );
}
