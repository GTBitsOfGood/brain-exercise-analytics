"use client";

import styles from "./Cell.module.css";

export interface CellProps {
  title: string;
  value?: string;
  icon: JSX.Element;
  link?: string;
}

export function Cell({ cell }: { cell: CellProps }) {
  return (
    <div className={styles.cell}>
      <div className={styles.cellIcon}>{cell.icon}</div>
      <div className={styles.cellInfo}>
        <div className={styles.cellTitle}>
          <p>{cell.title}</p>
        </div>
        <div className={styles.cellContent}>
          <p className={styles.cellValue}>{cell.value}</p>
          {cell.link && <div className={styles.cellArrow} />}
        </div>
      </div>
    </div>
  );
}
