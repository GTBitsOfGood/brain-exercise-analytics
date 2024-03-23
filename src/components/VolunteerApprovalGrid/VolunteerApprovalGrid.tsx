"use client";

import React from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { IUser, Role, SortField } from "@/common_utils/types";
import { GridColDef } from "@src/utils/types";

import { sampleUsers } from "@src/utils/patients";
import styles from "./VolunteerApprovalGrid.module.css";
import { Row } from "./Row/Row";

interface VolunteerApprovalGridProps {
  data: IUser[];
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  currentPage: number;
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
      <col style={{ width: "30%" }} />
      <col style={{ width: "20%" }} />
    </colgroup>
  );
}

export default function VolunteerApprovalGrid(
  params: VolunteerApprovalGridProps,
) {
  // Construct Rows from the sampleUsers
  const Rows = sampleUsers.map((volunteer) => {
    // changing the role of sampleUsers for testing purposes. Remove this once integrated with actual data.
    const v: IUser = { ...volunteer, role: Role.NONPROFIT_VOLUNTEER };
    return <Row key={`volunteer-${volunteer._id}`} volunteer={v} />;
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
      <Pagination
        setCurrentPage={params.setCurrentPage}
        pageCount={params.pageCount}
        currentPage={params.currentPage}
      />
    </div>
  );
}
