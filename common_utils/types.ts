/* eslint-disable prettier/prettier */
export type RecursivePartial<T> =
  T extends Date ? T :                                       // Leave Date objects alone
  // Also of note: possibly add cases for Set, Map, other JS builtins...
  T extends (infer U)[] ? RecursivePartial<U>[] :            // Recurse into array types!
  T extends object ? {[P in keyof T]?: RecursivePartial<T[P]>} : // Recurse into object types!
  T;                                                         // Leave other types as-is.
/* eslint-enable prettier/prettier */

/* Internal Request & API Wrapper Types */

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
  payload?: T;
}

export class InternalResponseError extends Error {}

export enum Role {
  NONPROFIT_ADMIN = "Nonprofit Admin",
  NONPROFIT_VOLUNTEER = "Nonprofit Volunteer",
  NONPROFIT_PATIENT = "Nonprofit Patient",
}

export enum Days {
  Sunday,
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
}

export enum AdminApprovalStatus {
  PENDING = "Pending",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export interface IUser {
  // the unqiue id assigned to a user. Let MongoDB create this when you insert a document
  // without any_id attribute
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  patientDetails: {
    birthDate: Date;
    secondaryContactName: string;
    secondaryContactPhone: string;
    additionalAffiliation: string;
  };
  adminDetails: {
    active: boolean;
  };
  chapter: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  signedUp: boolean;
  verified: boolean;
  approved: AdminApprovalStatus;
  role: Role;
}

export interface IVerificationLog {
  email: string;
  token: string;
  createdAt: Date;
}

export interface IAnalytics {
  // the unqiue id assigned to a user. Let MongoDB create this when you insert a document
  // without any_id attribute
  _id?: string;
  userID: string;
  totalSessionsCompleted: number;
  startDate: Date;
  active: boolean;
  streak: [string];
  lastSessionMetrics: {
    date: Date;
    math: {
      questionsAttempted: number;
      questionsCorrect: number;
      finalDifficultyScore: number;
      timePerQuestion: number;
    };
    trivia: {
      questionsAttempted: number;
      questionsCorrect: number;
      timePerQuestion: number;
    };
    reading: {
      passagesRead: number;
      timePerPassage: number;
      wordsPerMinute: number;
    };
    writing: {
      questionsAnswered: number;
      timePerQuestion: number;
    };
  };
  weeklyMetrics: [
    {
      date: Date;
      sessionsCompleted: number;
      streakLength: number;
      active: boolean;
      math: {
        sessionsCompleted: number;
        questionsAttempted: number;
        questionsCorrect: number;
        finalDifficultyScore: number;
        timePerQuestion: number;
      };
      trivia: {
        sessionsCompleted: number;
        questionsAttempted: number;
        questionsCorrect: number;
        timePerQuestion: number;
      };
      reading: {
        sessionsAttempted: number;
        sessionsCompleted: number;
        passagesRead: number;
        timePerPassage: number;
        wordsPerMinute: number;
      };
      writing: {
        sessionsAttempted: number;
        sessionsCompleted: number;
        questionsAnswered: number;
        timePerQuestion: number;
      };
    },
  ];
}

/* VerificationLog MongoDB Schema Types */

export enum VerificationLogType {
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

/* authUser Cookie Type */

export interface IAuthUserCookie {
  user: IUser;
  keepLogged: boolean;
}

/* Analytics Data */

export interface DataRecord {
  interval: string;
  value: number;
}

export interface StackedDataRecord extends DataRecord {
  stackedValue: number;
}

/* Search Types */

export type SortField = {
  field: string;
  ascending: boolean;
};

export interface SearchRequestBody<T extends object> {
  params: T;
  page: number;
  sortParams?: SortField;
}

export interface SearchResponseBody<T> {
  data: T[];
  numRecords: number;
  numPages: number;
  page: number;
}

/* Patient Search Specific Types */

export type PatientSearchParams = {
  name?: string;
  dateOfBirths?: string[];
  emails?: string[];
  additionalAffiliations?: string[];
  secondaryNames?: string[];
  secondaryPhones?: string[];
  beiChapters?: string[];
  active?: boolean;
  countries?: string[];
  states?: string[];
  cities?: string[];
  dateOfJoins?: string[];
};

export interface IPatientTableEntry
  extends Omit<
    IUser,
    | "phoneNumber"
    | "role"
    | "signedUp"
    | "verified"
    | "approved"
    | "adminDetails"
  > {
  active: boolean;
  startDate: Date;
}
