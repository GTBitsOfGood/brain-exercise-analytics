"use client";

import { IPatientTableEntry, SortField } from "@/common_utils/types";
import { transformDate } from "@src/utils/utils";
import { useMemo } from "react";
import { GridColDef } from "@src/utils/types";
import DataGrid from "../DataGrid/DataGrid";
import Pagination from "../Pagination/Pagination";
import styles from "./PatientGrid.module.css";
import { GridRowDef } from "./types";
import { Row } from "./Row/Row";

interface PatientGridProps {
  data: IPatientTableEntry[];
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  currentPage: number;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "", width: 90 },
  {
    field: "firstName",
    headerName: "First Name",
    sortable: true,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    sortable: true,
  },
  {
    field: "patientDetails.birthDate",
    headerName: "Date of Birth",
    type: "string",
    sortable: true,
  },
  {
    field: "active",
    headerName: "Active",
    type: "string",
    sortable: true,
  },

  {
    field: "email",
    headerName: "Email Address",
    type: "string",
    sortable: true,
  },

  {
    field: "chapter",
    headerName: "BEI Chapter",
    type: "string",
    sortable: true,
  },

  {
    field: "database",
    headerName: "Database",
    type: "string",
  },
];

function ColumnSizes() {
  return (
    <colgroup>
      <col style={{ width: "2%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "10%" }} />
      <col style={{ width: "11%" }} />
      <col style={{ width: "7%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "18%" }} />
      <col style={{ width: "8%" }} />
    </colgroup>
  );
}

export default function PatientGrid(params: PatientGridProps) {
  const rows = useMemo<GridRowDef[]>(
    () =>
      params.data.map(
        (v) =>
          ({
            id: v._id,
            firstName: v.firstName,
            lastName: v.lastName,
            dateOfBirth: transformDate(v.birthDate),
            active: v.active,
            email: v.email,
            chapter: v.chapter,
            location: v.location,
            dateStart: transformDate(v.startDate),
            secondContactName: v.patientDetails.secondaryContactName,
            secondContactPhone: v.patientDetails.secondaryContactPhone,
            additionalAffiliation: v.patientDetails.additionalAffiliation,
          }) as GridRowDef,
      ),
    [params.data],
  );

  const Rows = useMemo(
    () => rows.map((row) => <Row key={row.id} row={row} />),
    [rows],
  );

  return (
    <div className={styles.Container}>
      <DataGrid
        columns={columns}
        sortField={params.sortField}
        setSortField={params.setSortField}
        ColumnSizes={ColumnSizes}
        Rows={Rows}
      />

      <Pagination
        setCurrentPage={params.setCurrentPage}
        pageCount={params.pageCount}
        currentPage={params.currentPage}
      />
    </div>
  );
}
