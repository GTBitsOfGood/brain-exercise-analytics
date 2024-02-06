"use client";

import { ITableEntry, SortField } from "@/common_utils/types";
import { transformDate } from "@src/utils/utils";
import { ReactNode, useMemo } from "react";
import { GridColDef, GridRowDef } from "@src/utils/types";
import DataGrid from "../DataGrid/DataGrid";
import Pagination from "../Pagination/Pagination";
import styles from "./PatientGrid.module.css";
interface DataParams {
  data: ITableEntry[];
  children?: ReactNode;
  sortField: SortField | undefined;
  setSortField: React.Dispatch<React.SetStateAction<SortField | undefined>>;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  numRecords: number;
  currentPage: number;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "", width: 90 },
  {
    field: "name",
    headerName: "First Name",
    sortable: true,
  },
  {
    field: "name",
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

export default function PatientGrid(params: DataParams) {
  const rows = useMemo<GridRowDef[]>(
    () =>
      params.data.map(
        (v, i) =>
          ({
            id: i,
            firstName: v.name.split(" ")[0],
            lastName: v.name.split(" ")[1],
            dateOfBirth: transformDate(v.patientDetails.birthDate),
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

  return (
    <div className={styles.Container}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 8,
            },
          },
        }}
        pageSizeOptions={[5]}
        sortField={params.sortField}
        setSortField={params.setSortField}
      />

      <Pagination
        setCurrentPage={params.setCurrentPage}
        pageCount={params.pageCount}
        totalUsers={params.numRecords}
        currentPage={params.currentPage}
      />
    </div>
  );
}
