import React, { useState } from "react";
import {
  faCircleCheck,
  faCircleXmark,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import { GridColDef, GridRowDef } from "../types";
import styles from "./DataGrid.module.css";
import { style } from "d3";

interface DataParams {
  columns: GridColDef[];
  rows: GridRowDef[];
}

function ExpandedRow({ row }: GridRowDef) {
  return (
    <tr>
      <td colSpan={8} className={styles.ExpandedRow}>
        <div>
          <Typography>Patient&apos;s Additional Information</Typography>
          <Typography>Date of Joined</Typography>
          <Typography>Additional Affiliation</Typography>
        </div>
      </td>
    </tr>
  );
}

function Row({ row }: { row: GridRowDef }) {
  const [view, setView] = useState<boolean>(false);
  const handleClick = () => setView(!view);
  return (
    <>
      <tr>
        <td className={styles.RowCell}>
          <button
            style={{
              backgroundColor: "white",
              border: 0,
              rotate: view ? "90deg" : "0deg",
            }}
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>{row.firstName}</div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>{row.lastName}</div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>{row.dateOfBirth}</div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>
            {!row.status && <FontAwesomeIcon icon={faCircleXmark} />}
            {row.status && <FontAwesomeIcon icon={faCircleCheck} />}
          </div>
        </td>
        <td className={styles.RowCell} style={{ scrollbarWidth: "none" }}>
          <div className={styles.RowCellContainer}>{row.email}</div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>{row.chapter}</div>
        </td>

        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>{row.location.country}</div>
        </td>
      </tr>
      {view && <ExpandedRow row={row} />}
    </>
  );
}

export default function DataGrid({ columns, rows }: DataParams) {
  return (
    <div className={styles.DataGrid}>
      <table className={styles.Table} style={{ width: "calc(100% - 15px)" }}>
        <colgroup>
          <col style={{ width: "2%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "5%" }} />
          <col style={{ width: "15%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
        </colgroup>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                className={styles.TopRow}
                style={{
                  position: "sticky",
                  top: "0",
                  zIndex: 2,
                  backgroundColor: "white",
                }}
                key={col.field}
              >
                {col.headerName}
              </th>
            ))}
          </tr>
        </thead>
      </table>
      <div style={{ overflowY: "auto", maxHeight: "500px" }}>
        <table className={styles.Table} style={{ width: "calc(100% - 15px)" }}>
          <colgroup>
            <col style={{ width: "2%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "5%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "12%" }} />
          </colgroup>
          <tbody>
            {rows.map((row, rowIndex) => (
              <Row key={rowIndex} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
