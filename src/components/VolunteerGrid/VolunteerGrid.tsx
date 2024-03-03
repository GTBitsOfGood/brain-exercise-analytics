"use client";

import React, { useState, useMemo } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { internalRequest } from "@src/utils/requests";
import {
  HttpMethod,
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

  // eslint-disable-next-line
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

  const handleConfirmDelete = async () => {
    if (deleteVolunteerId !== null) {
      setExcludedIds((current) => [...current, deleteVolunteerId]);
      // eslint-disable-next-line
      data = data.filter(
        (volunteer) =>
          !excludedIds.includes(volunteer.id) &&
          volunteer.id !== deleteVolunteerId,
      );

      await internalRequest({
        url: "/api/volunteer",
        method: HttpMethod.DELETE,
        body: {
          email: "volunteerEmail@email.com",
        },
      });

      setDeleteVolunteerId(null);
    }
    setPopupOpen(false);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
    setDeleteVolunteerId(null);
  };

  const handleDeleteClick = async (id: number) => {
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
            // eslint-disable-next-line
            onChange={async(e: SelectChangeEvent<VolunteerAccessLevel>) => {
              await internalRequest({
                url: "/api/volunteer",
                method: HttpMethod.PATCH,
                body: {
                  email: "volunteerEmail@email.com",
                  newFields: {
                    accessLevel: dropdownValues[volunteer.id].accessLevel,
                  },
                },
              });
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
            // eslint-disable-next-line
            onChange={async(e: SelectChangeEvent<VolunteerStatus>) => {
              await internalRequest({
                url: "/api/volunteer",
                method: HttpMethod.PATCH,
                body: {
                  email: "volunteerEmail@email.com",
                  newFields: {
                    status: dropdownValues[volunteer.id].status,
                  },
                },
              });
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
