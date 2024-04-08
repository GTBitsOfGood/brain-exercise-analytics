import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  Header,
  columns,
  sortField,
  setSortField,
  ColumnSizes,
  Rows,
}: GridDataParams) {
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
