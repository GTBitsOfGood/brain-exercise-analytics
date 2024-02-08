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
  fullWidth?: boolean;
  style?: CSSProperties;
}

export interface GridColDef {
  field: string;
  headerName: string;
  width?: number | string;
  type?: "string";
  sortable?: boolean;
}
