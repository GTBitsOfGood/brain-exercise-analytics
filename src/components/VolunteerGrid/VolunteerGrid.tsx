"use client";

import React, { useCallback, useState } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod, IUser, Role, SortField } from "@/common_utils/types";
import { GridColDef } from "@src/utils/types";
import { sampleUsers } from "@src/utils/patients";
import styles from "./VolunteerGrid.module.css";
import Popup from "./Popup/Popup";
import Row from "./Row/Row";

const volunteersColumns: GridColDef[] = [
  { field: "firstName", headerName: "Name", sortable: true },
  { field: "startDate", headerName: "Date Joined", sortable: true },
  { field: "role", headerName: "Access Level", sortable: true },
  { field: "active", headerName: "Status", sortable: true },
  { field: "actions", headerName: "", sortable: false },
];

const VolunteerGrid: React.FC<{ data: IUser[] }> = ({ data }) => {
  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const itemsPerPage = 10;
  const pageCount = Math.ceil(data.length / itemsPerPage);
  const [popupOpen, setPopupOpen] = useState(false);
  const [deleteVolunteerId, setDeleteVolunteerId] = useState<string | null>(
    null,
  );

  const handleConfirmDelete = async () => {
    if (deleteVolunteerId !== null) {
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

  const handleClosePopup = useCallback(() => {
    setPopupOpen(false);
    setDeleteVolunteerId(null);
  }, []);

  const handleDeleteClick = useCallback(async (id: string) => {
    setDeleteVolunteerId(id);
    setPopupOpen(true);
  }, []);

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

  // Construct Rows from the sampleUsers
  const Rows = sampleUsers.map((volunteer) => {
    // changing the role of sampleUsers for testing purposes. Remove this once integrated with actual data.
    const v: IUser = { ...volunteer, role: Role.NONPROFIT_VOLUNTEER };
    return (
      <Row
        key={`volunteer-${volunteer._id}`}
        volunteer={v}
        handleDeleteClick={handleDeleteClick}
      />
    );
  });

  return (
    <div className={styles.volunteerGridWrapper}>
      <div className={styles.volunteerGridTable}>
        <DataGrid
          columns={volunteersColumns}
          sortField={sortField}
          setSortField={setSortField}
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
