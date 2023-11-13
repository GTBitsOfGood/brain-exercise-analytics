"use client";

import { ITableEntry } from "@/common_utils/types";
import { transformDate } from "@src/utils/utils";
import { ReactNode, useMemo } from "react";
import { GridColDef, GridRowDef, SortField } from "../types";
import DataGrid from "../DataGrid/DataGrid";

interface DataParams {
  data: ITableEntry[];
  children?: ReactNode;
  sortField: SortField;
  setSortField: React.Dispatch<React.SetStateAction<SortField>>;
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

  const sortedRows = useMemo<GridRowDef[]>(() => {
    if (!params.sortField) {
      return rows;
    }
    return [...rows].sort((a, b) => {
      const { ascending, field } = params.sortField as NonNullable<SortField>;

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const aVal = a[field] as string | boolean;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const bVal = b[field] as string | boolean;

      if (typeof aVal === "boolean" || typeof bVal === "boolean") {
        return ascending ? +aVal - +bVal : +bVal - +aVal;
      }

      if (field === "dateOfBirth" || field === "dateStart") {
        const aDate = new Date(aVal);
        const bDate = new Date(bVal);

        if (ascending) {
          return aDate.getTime() - bDate.getTime();
        }
        return bDate.getTime() - aDate.getTime();
      }

      if (ascending) {
        return aVal.localeCompare(bVal);
      }
      return bVal.localeCompare(aVal);
    });
  }, [params.sortField, rows]);

  return (
    <DataGrid
      rows={sortedRows}
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
  );
}
