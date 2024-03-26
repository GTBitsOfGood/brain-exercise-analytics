"use client";

import React, { useCallback, useState } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod, IUser, SortField } from "@/common_utils/types";
import { GridColDef } from "@src/utils/types";
import styles from "./VolunteerGrid.module.css";
import Popup from "./Popup/Popup";
import { Row } from "./Row/Row";

interface VolunteerGridProps {
  data: IUser[];
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  currentPage: number;
  refreshUsers: () => void;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "", width: 90 },
  { field: "firstName", headerName: "Name", sortable: true },
  { field: "startDate", headerName: "Date Joined", sortable: true },
  { field: "role", headerName: "Access Level", sortable: true },
  { field: "adminDetails.active", headerName: "Status", sortable: true },
  { field: "actions", headerName: "", sortable: false },
];

function ColumnSizes() {
  return (
    <colgroup>
      <col style={{ width: "2%" }} />
      <col style={{ width: "20%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "20%" }} />
      <col style={{ width: "20%" }} />
      <col style={{ width: "13%" }} />
    </colgroup>
  );
}

export default function VolunteerGrid(params: VolunteerGridProps) {
  const [popupOpen, setPopupOpen] = useState(false);
  const [deleteVolunteerEmail, setDeleteVolunteerEmail] = useState<
    string | null
  >(null);

  const handleConfirmDelete = async () => {
    if (deleteVolunteerEmail !== null) {
      await internalRequest({
        url: "/api/volunteer",
        method: HttpMethod.DELETE,
        body: {
          email: deleteVolunteerEmail,
        },
      });

      setDeleteVolunteerEmail(null);
      params.refreshUsers();
    }
    setPopupOpen(false);
  };

  const handleClosePopup = useCallback(() => {
    setPopupOpen(false);
    setDeleteVolunteerEmail(null);
  }, []);

  const handleDeleteClick = useCallback(async (email: string) => {
    setDeleteVolunteerEmail(email);
    setPopupOpen(true);
  }, []);

  // Construct Rows from the data
  const Rows = params.data.map((volunteer) => {
    return (
      <Row
        key={`volunteer-${volunteer._id}`}
        volunteer={volunteer}
        handleDeleteClick={handleDeleteClick}
      />
    );
  });

  return (
    <div className={styles.volunteerGridWrapper}>
      <div className={styles.volunteerGridTable}>
        <DataGrid
          columns={columns}
          sortField={params.sortField}
          setSortField={params.setSortField}
          ColumnSizes={ColumnSizes}
          Rows={Rows}
        />
      </div>
      {popupOpen && (
        <Popup onClose={handleClosePopup} onConfirm={handleConfirmDelete} />
      )}
      <Pagination
        setCurrentPage={params.setCurrentPage}
        pageCount={params.pageCount}
        currentPage={params.currentPage}
      />
    </div>
  );
}
