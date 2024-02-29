import React, { useState, useMemo } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import {
  SortField,
  VolunteerAccessLevel,
  VolunteerStatus,
} from "@/common_utils/types";
import { classes } from "@src/utils/utils";
import Dropdown, { DropdownOption } from "@src/components/Dropdown/Dropdown";
import { SelectChangeEvent } from "@mui/material";
import styles from "./VolunteerGrid.module.css";
import Popup from "./Popup/Popup";

interface IVolunteer {
  id: number;
  name: string;
  accessLevel: string;
  dateJoined: string;
  status: boolean;
}

interface GridColDef<T> {
  field: string;
  headerName: string;
  sortable?: boolean;
  renderCell?: (params: T) => JSX.Element;
}

const volunteersColumns: GridColDef<IVolunteer>[] = [
  { field: "name", headerName: "Name", sortable: true },
  { field: "dateJoined", headerName: "Date Joined", sortable: true },
  { field: "accessLevel", headerName: "Access Level", sortable: true },
  { field: "status", headerName: "Status", sortable: true },
  { field: "actions", headerName: "", sortable: false },
];

const VolunteerGrid: React.FC<{ data: IVolunteer[] }> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const [popupOpen, setPopupOpen] = useState(false);
  const [deleteVolunteerId, setDeleteVolunteerId] = useState<number | null>(
    null,
  );
  const [excludedIds, setExcludedIds] = useState<number[]>([]);

  const [dropdownValues, setDropdownValues] = useState<{
    [volunteerId: number]: {
      accessLevel: VolunteerAccessLevel;
      status: VolunteerStatus;
    };
  }>(
    data.reduce(
      (acc, cur) => ({
        ...acc,
        [cur.id]: { accessLevel: cur.accessLevel, status: cur.status },
      }),
      {},
    ),
  );

  const handleConfirmDelete = () => {
    if (deleteVolunteerId !== null) {
      setExcludedIds((current) => [...current, deleteVolunteerId]);
      // eslint-disable-next-line
      data = data.filter(
        (volunteer) =>
          !excludedIds.includes(volunteer.id) &&
          volunteer.id !== deleteVolunteerId,
      );
      setDeleteVolunteerId(null);
    }
    setPopupOpen(false);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setDeleteVolunteerId(null);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteVolunteerId(id);
    setPopupOpen(true);
  };

  const currentItems = useMemo(() => {
    const start = currentPage * itemsPerPage;
    const end = start + itemsPerPage;
    return data
      .filter((volunteer) => !excludedIds.includes(volunteer.id))
      .slice(start, end);
  }, [currentPage, itemsPerPage, data, excludedIds]);

  function ColumnSizes() {
    return (
      <colgroup>
        <col style={{ width: "20%" }} />
        <col style={{ width: "15%" }} />
        <col style={{ width: "20%" }} />
        <col style={{ width: "20%" }} />
        <col style={{ width: "11%" }} />
      </colgroup>
    );
  }

  const accessLevelOptions: DropdownOption<VolunteerAccessLevel>[] =
    Object.values(VolunteerAccessLevel).map((range) => ({
      value: range,
      displayValue: range.toString(),
    }));

  const volunteerStatusOptions: DropdownOption<VolunteerStatus>[] =
    Object.values(VolunteerStatus).map((range) => ({
      value: range,
      displayValue: range.toString(),
    }));

  // Construct Rows from the currentItems
  const Rows = currentItems.map((volunteer) => (
    <tr className={styles.row} key={volunteer.id}>
      <td className={styles.RowCell}>
        <div
          className={classes(styles.RowCellContainer, styles.nameCellContainer)}
        >
          {volunteer.name}
        </div>
      </td>
      <td className={styles.RowCell}>
        <div
          className={classes(styles.RowCellContainer, styles.dateCellContainer)}
        >
          {volunteer.dateJoined}
        </div>
      </td>
      <td className={styles.RowCell}>
        <div className={styles.RowCellContainer}>
          <Dropdown
            options={accessLevelOptions}
            value={dropdownValues[volunteer.id].accessLevel}
            showError={false}
            onChange={(e: SelectChangeEvent<VolunteerAccessLevel>) => {
              const newAccessLevel = e.target.value as VolunteerAccessLevel;
              setDropdownValues((prev) => ({
                ...prev,
                [volunteer.id]: {
                  ...prev[volunteer.id],
                  accessLevel: newAccessLevel,
                },
              }));
            }}
            style={{
              borderRadius: 41,
              color: "#2B3674",
              backgroundColor: "#E3EAFC",
              border: "none",
              width: "min-content",
              maxWidth: "90%",
              textAlign: "center",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
            sx={{
              "&.MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "41px",
                },
              },
            }}
            menuItemStyle={{
              justifyContent: "left",
              fontSize: "12px",
              color: "#2B3674",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          />
        </div>
      </td>
      <td className={classes(styles.RowCell, styles.statusContainer)}>
        <span className={styles.RowCellContainer}>
          <Dropdown
            options={volunteerStatusOptions}
            value={dropdownValues[volunteer.id].status}
            showError={false}
            onChange={(e: SelectChangeEvent<VolunteerStatus>) => {
              const newStatus = e.target.value as VolunteerStatus;
              setDropdownValues((prev) => ({
                ...prev,
                [volunteer.id]: { ...prev[volunteer.id], status: newStatus },
              }));
            }}
            style={{
              borderRadius: 41,
              color: "#2B3674",
              backgroundColor: "#D6F6EA",
              border: "none",
              width: "min-content",
              maxWidth: "100%",
              textAlign: "center",
              fontSize: "14px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
            sx={{
              "&.MuiOutlinedInput-root": {
                "& fieldset": {
                  borderRadius: "41px",
                },
              },
            }}
            menuItemStyle={{
              justifyContent: "left",
              fontSize: "12px",
              color: "#2B3674",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          />
        </span>
      </td>
      <td>
        <text
          className={classes(
            styles.RowCell,
            styles.RowCellContainer,
            styles.deleteButton,
          )}
          onClick={() => handleDeleteClick(volunteer.id)}
        >
          Delete Account
        </text>
      </td>
    </tr>
  ));

  return (
    <div className={styles.volunteerGridWrapper}>
      <div className={styles.volunteerGridTable}>
        <DataGrid
          columns={volunteersColumns}
          sortField={sortField}
          setSortField={setSortField}
          rows={currentItems}
          ColumnSizes={ColumnSizes}
          Rows={Rows}
        />
      </div>
      {popupOpen && (
        <Popup onClose={handleClosePopup} onConfirm={handleConfirmDelete} />
      )}
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageCount={pageCount}
      />
    </div>
  );
};

export default VolunteerGrid;
