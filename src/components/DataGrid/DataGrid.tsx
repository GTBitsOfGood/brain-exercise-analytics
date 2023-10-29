import React, { useState } from "react";
import { GridColDef, GridRowDef } from "../types";
import {
  faCircleCheck,
  faCircleXmark,
  faCaretRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Typography } from "@mui/material";
import styles from "./DataGrid.module.css";

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
        <td className={styles.Row}>
          <button
            style={{ backgroundColor: "white", border: 0 }}
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </td>
        <td className={styles.Row}>{row.firstName}</td>
        <td className={styles.Row}>{row.lastName}</td>
        <td className={styles.Row}>{row.dateOfBirth}</td>
        <td className={styles.Row}>
          {!row.status && <FontAwesomeIcon icon={faCircleXmark} />}
          {row.status && <FontAwesomeIcon icon={faCircleCheck} />}
        </td>
        <td className={styles.Row}>{row.email}</td>
        <td className={styles.Row}>{row.chapter}</td>

        <td className={styles.Row}>{row.location.country}</td>
      </tr>
      {view && <ExpandedRow row={row} />}
    </>
  );
}

export default function DataGrid({ columns, rows }: DataParams) {
  return (
    <div
      style={{
        width: "1353px",
        height: "638.37px",
        paddingTop: "90px",
        paddingLeft: "49px",
        paddingRight: "76px",
        paddingBottom: "35px",
        backgroundColor: "white",
        overflow: "hidden",
        borderRadius: "15px",
      }}
    >
      <table className={styles.Table} style={{ width: "calc(100% - 15px)" }}>
        <colgroup>
          <col style={{ width: "2%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "12%" }} />
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
            <col style={{ width: "10%" }} />
            <col style={{ width: "12%" }} />
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
