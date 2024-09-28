"use client";

import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classes } from "@src/utils/utils";
import styles from "./Cell.module.css";

export interface CellProps {
  title: string;
  value?: string;
  icon: JSX.Element;
  link?: string;
}

export function Cell({ cell }: { cell: CellProps }) {
  return (
    <div className={classes(styles.cell, cell.link && styles.hover)}>
      <div className={styles.cellIcon}>{cell.icon}</div>
      <div className={styles.cellInfo}>
        <div className={styles.cellTitle}>
          <p>{cell.title}</p>
        </div>
        <div className={styles.cellContent}>
          <p className={styles.cellValue}>{cell.value}</p>
          {cell.link && (
            <div className={styles.cellArrow}>
              <FontAwesomeIcon
                icon={faAngleRight}
                style={{ color: "#2b3674" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
