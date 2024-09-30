"use client";

import React, { useCallback, useState } from "react";
import DataGrid from "@src/components/DataGrid/DataGrid";
import Pagination from "@src/components/Pagination/Pagination";
import { internalRequest } from "@src/utils/requests";
import {
  HttpMethod,
  IChapter,
  IChapterTableEntry,
  SortField,
} from "@/common_utils/types";
import { GridColDef } from "@src/utils/types";
import TwoVolunteersIcon from "@src/app/icons/TwoVolunteersIcon";
import styles from "./ChapterGrid.module.css";
import { Row } from "./Row/Row";

interface ChapterGridProps {
  data: IChapterTableEntry[];
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  currentPage: number;
}

const columns: GridColDef[] = [
  { field: "name", headerName: "Name", sortable: true },
  { field: "location", headerName: "Location", sortable: true },
  { field: "yearFounded", headerName: "Year Founded", sortable: true },
  { field: "volunteers", headerName: "Active Volunteers", sortable: true },
  { field: "active", headerName: "Status", sortable: true },
  { field: "actions", headerName: "", sortable: false },
];

function ColumnSizes() {
  return (
    <colgroup>
      <col style={{ width: "25%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "15%" }} />
      <col style={{ width: "10%" }} />
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
    return <Row chapter={chapter} />;
  });

  return (
    <div className={styles.chapterGridWrapper}>
      <div className={styles.chapterGridTable}>
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
      />
    </div>
  );
}
