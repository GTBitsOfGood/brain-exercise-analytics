import { NumberValue } from "d3";
import { CSSProperties } from "react";

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PATCH = "PATCH",
  PUT = "PUT",
  DELETE = "DELETE",
}

export interface InternalRequestData {
  url: string;
  method: HttpMethod;
  body?: { [key: string]: unknown };
  queryParams?: { [key: string]: string | number | boolean | undefined };
  authRequired?: boolean;
}

export interface InternalResponseData<T> {
  success: boolean;
  message?: string;
  payload: T;
}

export class InternalResponseError extends Error {}

export interface D3Data {
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

export interface GridRowDef {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  dateStart: string;
  secondContactName: string;
  secondContactPhone: string;
  additionalAffiliation: string;
  status: boolean;
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

export type SortField =
  | {
      field: string;
      ascending: boolean;
    }
  | undefined;
