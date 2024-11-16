"use client";

import React, { useState } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { IUser, SortField } from "@/common_utils/types";
import { GridColDef } from "@src/utils/types";
import TwoVolunteersIcon from "@src/app/icons/TwoVolunteersIcon";

import { Row } from "./Row/Row";
import styles from "./VolunteerApprovalGrid.module.css";
import Modal from "../Modal/Modal";
import OperationSuccessModal from "../OperationSuccessModal/OperationSuccessModal";

interface VolunteerApprovalGridProps {
  data: IUser[];
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  currentPage: number;
  refreshUsers: () => void;
  entriesPerPage: number;
  setEntriesPerPage: (arg: number) => void
}

const columns: GridColDef[] = [
  { field: "id", headerName: "", width: 90 },
  { field: "firstName", headerName: "Name", sortable: true },
  { field: "startDate", headerName: "Date Joined", sortable: true },
  { field: "role", headerName: "Access Level", sortable: true },
  { field: "actions", headerName: "", sortable: false },
];

function ColumnSizes() {
  return (
    <colgroup>
      <col style={{ width: "2%" }} />
      <col style={{ width: "25%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "27%" }} />
      <col style={{ width: "20%" }} />
    </colgroup>
  );
}

function Header() {
  return (
    <div className={styles["table-header"]}>
      <TwoVolunteersIcon />
      <p className={styles["table-header-text"]}>Volunteer List</p>
    </div>
  );
}

export default function VolunteerApprovalGrid(
  params: VolunteerApprovalGridProps,
) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Construct Rows from the volunteers
  const Rows = params.data.map((volunteer) => {
    return (
      <Row
        key={`volunteer-${volunteer._id}`}
        volunteer={volunteer}
        refreshUsers={params.refreshUsers}
        setShowModal={setShowSuccessModal}
        setSuccessMessage={setSuccessMessage}
      />
    );
  });

  return (
    <div className={styles.volunteerGridWrapper}>
      <div className={styles.volunteerGridTable}>
        <DataGrid
          Header={<Header />}
          columns={columns}
          sortField={params.sortField}
          setSortField={params.setSortField}
          ColumnSizes={ColumnSizes}
          Rows={Rows}
        />
      </div>
      <Pagination
        setCurrentPage={params.setCurrentPage}
        pageCount={params.pageCount}
        currentPage={params.currentPage}
        entriesPerPage={params.entriesPerPage}
        setEntriesPerPage={params.setEntriesPerPage}
      />
      <Modal showModal={showSuccessModal} setShowModal={setShowSuccessModal}>
        <OperationSuccessModal
          className={styles.operationSuccessModal}
          subtitle={successMessage}
        />
      </Modal>
    </div>
  );
}
