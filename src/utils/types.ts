import { DataRecord } from "@/common_utils/types";
import { NumberValue } from "d3";
import { CSSProperties } from "react";

export interface D3Data {
  data: DataRecord[];
  yAxis?: {
    min: number;
    max: number;
    numDivisions: number;
    format?(this: void, d: NumberValue): string;
  };
  width?: number;
  height?: number;
  style?: CSSProperties;
}

export interface GridRowDef {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateStart: string;
  secondContactName: string;
  secondContactPhone: string;
  additionalAffiliation: string;
  active: boolean;
  email: string;
  chapter: string;
  location: { country: string; state: string; city: string };
}
export interface GridColDef {
  field: string;
  headerName: string;
  width?: number | string;
  type?: "string";
  sortable?: boolean;
}
