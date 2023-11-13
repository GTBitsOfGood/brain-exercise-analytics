"use client";

import { ITableEntry } from "@/common_utils/types";
import { transformDate } from "@src/utils/utils";
import { ReactNode, useMemo } from "react";
import { GridColDef, GridRowDef } from "../types";
import DataGrid from "../DataGrid/DataGrid";

interface DataParams {
  data: ITableEntry[];
  children?: ReactNode;
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
    field: "dateOfBirth",
    headerName: "Date of Birth",
    type: "string",
    sortable: true,
  },
  {
    field: "status",
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
            status: v.status,
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
    />
  );
}
