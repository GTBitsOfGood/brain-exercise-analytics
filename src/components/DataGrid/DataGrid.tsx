import { faCaretUp, faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ExclamationOutlinedIcon } from "@src/app/icons";
import { classes } from "@src/utils/utils";
import { SortField } from "@/common_utils/types";
import { GridColDef } from "@src/utils/types";
import styles from "./DataGrid.module.css";

export interface GridDataParams {
  Header?: React.ReactElement;
  columns: GridColDef[];
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
  ColumnSizes: React.FC;
  Rows: React.ReactElement[];
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
    onClick({
      field,
      ascending: active ? !sortField.ascending : true,
    });
  };

  return (
    <FontAwesomeIcon
      className={classes(
        styles.SortButton,
        !active && styles.SortButtonInactive,
      )}
      onClick={handleClick}
      icon={active && !sortField.ascending ? faCaretDown : faCaretUp}
    />
  );
}

export default function DataGrid({
  Header,
  columns,
  sortField,
  setSortField,
  ColumnSizes,
  Rows,
}: GridDataParams) {
  if (Rows.length === 0) {
    return (
      <div className={styles.noResultsContainer}>
        <ExclamationOutlinedIcon />
        <div>No results found</div>
      </div>
    );
  }
  return (
    <div className={styles.DataGrid}>
      <div className={styles.Container}>
        {Header}
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
          <tbody>{Rows}</tbody>
        </table>
      </div>
    </div>
  );
}
