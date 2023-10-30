import { NumberValue } from "d3";
import { CSSProperties } from "react";

interface D3Data {
  data: { interval: string; value: number }[];
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

export type { D3Data };
