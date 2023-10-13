import { NumberValue } from "d3";

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
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  style?: object;
}

export type { D3Data };
