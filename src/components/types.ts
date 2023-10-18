import { DataRecord } from "@/common_utils/types";
import { NumberValue } from "d3";

interface D3Data {
  data: DataRecord[];
  yAxis?: {
    min: number;
    max: number;
    numDivisions: number;
    format?(this: void, d: NumberValue): string;
  };
  width?: number;
  height?: number;
  style?: object;
}

export type { D3Data };
