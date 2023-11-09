import React, { useState } from "react";
import {
  faCircleCheck,
  faCircleXmark,
  faCaretRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GridColDef, GridRowDef } from "../types";
import styles from "./DataGrid.module.css";

interface DataParams {
  columns: GridColDef[];
  rows: GridRowDef[];
}

interface ExtendedDataParams extends DataParams {
  initialState?: {
    pagination: {
      paginationModel: {
        pageSize: number;
      };
    };
  };
  pageSizeOptions?: number[];
}

function ExpandedRow({ row }: { row: GridRowDef }) {
  return (
    <tr>
      <td colSpan={8} className={styles.ExpandedRow}>
        <div className={styles.ExpandedRowContainer}>
          <div className={styles.ExpandedRowColumn}>
            <div>Patient Additional Information</div>
            <div>
              <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; <strong>Date of
              Joined</strong>&nbsp; {row.dateStart}
            </div>

            <div>
              <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; <strong>Additional
              Affiliation</strong>&nbsp;{" "}
            </div>
          </div>

          <div className={styles.ExpandedRowColumn}>
            <div>Secondary Contact Person</div>
            <div>
              <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; <strong>Name</strong>&nbsp;{" "}
              {row.secondContactName}
            </div>
            <div>
              <FontAwesomeIcon icon={faPaperPlane} /> &nbsp; <strong>Contact</strong>&nbsp;{" "}
              {row.secondContactPhone}
            </div>
          </div>
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

export default function DataGrid({ columns, rows }: ExtendedDataParams) {
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
