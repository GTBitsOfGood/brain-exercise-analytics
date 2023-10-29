import { ITableEntry } from "@/common_utils/types";
import { ReactNode, useEffect, useState } from "react";
import { GridColDef, GridRowDef } from "../types";
import DataGrid from "../DataGrid/DataGrid";

interface DataParams {
  data: ITableEntry[];
  children?: ReactNode;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "firstName",
    headerName: "First Name",
    width: 150,
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 150,
  },
  {
    field: "dateOfBirth",
    headerName: "Date of Birth",
    type: "string",
    width: 110,
  },
  {
    field: "status",
    headerName: "Active",
    type: "string",
    width: 150,
  },

  {
    field: "email",
    headerName: "Email Address",
    type: "string",
    width: 150,
  },

  {
    field: "chapter",
    headerName: "BEI Chapter",
    type: "string",
    width: 150,
  },

  {
    field: "location",
    headerName: "Location",
    type: "string",
    width: 150,
  },
];

export default function PatientGrid(params: DataParams) {
  const [rows, setRows] = useState<GridRowDef[]>([]);
  useEffect(() => {
    setRows(
      params.data.map(
        (v, i) =>
          ({
            id: i,
            firstName: v.name.split(" ")[0],
            lastName: v.name.split(" ")[1],
            dateOfBirth: v.patientDetails.birthdate,
            status: v.status,
            email: v.email,
            chapter: v.ch,
            location: v.location,
          }) as GridRowDef,
      ),
    );
  }, [params.data]);
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
      checkboxSelection
      disableRowSelectionOnClick
    />
  );
}
