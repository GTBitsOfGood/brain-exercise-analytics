import React, { useCallback, useState } from "react";
import {
  faCircleCheck,
  faCircleXmark,
  faCaretRight,
  faPaperPlane,
  faAngleUp,
  faAngleDown,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classes, transformPhoneNumber } from "@src/utils/utils";
import { SortField } from "@/common_utils/types";
import { GridColDef, GridRowDef } from "@src/utils/types";
import styles from "./DataGrid.module.css";

interface DataParams {
  columns: GridColDef[];
  rows: GridRowDef[];
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
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
  onClick?: () => void;
}

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

function Row({ row }: { row: GridRowDef }) {
  const [view, setView] = useState<boolean>(false);
  const handleClick = useCallback(() => setView((v) => !v), []);
  const router = useRouter();

  const handleDashboardClick = useCallback(() => {
    // router.push(`/patient/dashboard/${row.id}`);
    router.push(`/patient/dashboard/650a7e3a301ab8b382b7034a`);
  }, [router]);

  return (
    <>
      <tr className={styles.Row}>
        <td className={styles.RowCell}>
          <button
            style={{
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
          <div className={styles.DatabaseButton} onClick={handleDashboardClick}>
            View
          </div>
        </td>
      </tr>
      {view && <ExpandedRow row={row} />}
    </>
  );
}

function ColumnSizes() {
  return (
    <colgroup>
      <col style={{ width: "2%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "7%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "8%" }} />
    </colgroup>
  );
}

function SortButton({
  field,
  sortField,
  onClick,
}: {
  field: string;
  sortField: SortField | undefined;
  onClick: (newSortField: SortField) => void;
}) {
  const active = sortField?.field === field;
  const handleClick = () => {
    if (active) {
      onClick({
        field,
        ascending: !sortField.ascending,
      });
    } else {
      onClick({ field, ascending: true });
    }
  };

  return (
    <div
      className={classes(
        styles.SortButton,
        !active && styles.SortButtonInactive,
      )}
      onClick={handleClick}
    >
      <FontAwesomeIcon
        icon={active && !sortField.ascending ? faAngleDown : faAngleUp}
      />
    </div>
  );
}

export default function DataGrid({
  columns,
  rows,
  sortField,
  setSortField,
}: ExtendedDataParams) {
  return (
    <div className={styles.DataGrid}>
      <div className={styles.Container}>
        <table className={styles.Table}>
          <ColumnSizes />
          <thead>
            <tr>
              {columns.map((col) => (
                <th className={styles.TopRow} key={col.field}>
                  <div className={styles.TopRowContainer}>
                    {col.headerName}
                    {col.sortable && (
                      <SortButton
                        field={col.field}
                        sortField={sortField}
                        onClick={setSortField}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <Row key={rowIndex} row={row} />
            ))}
          </tbody>
        </table>
        {/* <div style={{ maxHeight: "500px" }}>
          <table
            className={styles.Table}
            style={{ width: "calc(100% - 15px)" }}
          >
            <ColumnSizes />
            <tbody>
              {rows.map((row, rowIndex) => (
                <Row key={rowIndex} row={row} />
              ))}
            </tbody>
          </table>
        </div> */}
      </div>
    </div>
  );
}
