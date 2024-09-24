"use client";

import React, { useCallback, useState } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod, IChapter, SortField } from "@/common_utils/types";
import { GridColDef } from "@src/utils/types";
import TwoVolunteersIcon from "@src/app/icons/TwoVolunteersIcon";
import styles from "./VolunteerGrid.module.css";
import { Row } from "./Row/Row";

interface ChapterGridProps {
  data: IChapter[];
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

function Header() {
  return (
    <div className={styles["table-header"]}>
      <TwoVolunteersIcon />
      <p className={styles["table-header-text"]}>BEI/ Chapter List</p>
    </div>
  );
}

export default function ChapterGrid(params: ChapterGridProps) {

  // Construct Rows from the data
  const Rows = params.data.map((chapter) => {
    return (
      <Row
        key={`chapter-${chapter.name}`}
        chapter={volunteer}
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
