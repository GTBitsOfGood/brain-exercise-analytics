/* This may not handle edge cases like Set, ArrayList, etc. */
export type RecursivePartial<T> = T extends Date
  ? T
  : T extends (infer U)[]
    ? RecursivePartial<U>[]
    : T extends object
      ? { [P in keyof T]?: RecursivePartial<T[P]> }
      : T;

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
  NONPROFIT_PATIENT = "Nonprofit Patient",
  NONPROFIT_VOLUNTEER = "Nonprofit Volunteer",
  NONPROFIT_ADMIN = "Nonprofit Admin",
  NONPROFIT_CHAPTER_PRESIDENT = "Nonprofit Chapter President",
  NONPROFIT_REGIONAL_COMMITTEE_MEMBER = "Nonprofit Regional Committee Member",
  NONPROFIT_DIRECTOR = "Nonprofit Director",
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

export enum DateRangeEnum {
  RECENT = "Most Recent",
  QUARTER = "3 Months",
  HALF = "6 Months",
  YEAR = "1 Year",
  MAX = "Max",
}

export enum AnalyticsSectionEnum {
  OVERALL = "overall",
  MATH = "math",
  TRIVIA = "trivia",
  READING = "reading",
  WRITING = "writing",
}

export interface IUser {
  // the unqiue id assigned to a user. Let MongoDB create this when you insert a document
  // without any_id attribute
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  birthDate: string;
  startDate: string;
  patientDetails: {
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
  imageLink: string;
}

export interface IVerificationLog {
  email: string;
  token: string;
  createdAt: Date;
}

export interface IAnalytics {
  _id?: string;
  userID: string;
  totalSessionsCompleted: number;
  active: boolean;
  streak: Days[];
  lastSessionMetrics: {
    date: Date;
    math: {
      attempted: boolean;
      questionsAttempted: number;
      questionsCorrect: number;
      finalDifficultyScore: number;
      timePerQuestion: number;
    };
    trivia: {
      attempted: boolean;
      questionsAttempted: number;
      questionsCorrect: number;
      timePerQuestion: number;
    };
    reading: {
      attempted: boolean;
      passagesRead: number;
      timePerPassage: number;
      wordsPerMinute: number;
      questionsAnswered: number;
      skipped: boolean;
    };
    writing: {
      attempted: boolean;
      questionsAnswered: number;
      timePerQuestion: number;
      skipped: boolean;
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

export interface IOverallAnalytics {
  activeUsers: number;
  totalUsers: number;
  weeklyMetrics: [
    {
      date: Date;
      totalUsers: number;
      activeUsers: number;
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
  page?: number;
  entriesPerPage?: number;
  sortParams?: SortField;
  lowerRoles?: Role[];
  searchall?: boolean;
  onlyids?: boolean;
  useAllRoles?: boolean;
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

export type IPatientSearchReducer = {
  fullName: string;
  active: boolean | undefined;
  countries: Array<string>;
  states: Array<string>;
  cities: Array<string>;
  dateOfBirths: Array<string>;
  emails: Array<string>;
  additionalAffiliations: Array<string>;
  dateOfJoins: Array<string>;
  beiChapters: Array<string>;
  secondaryPhones: Array<string>;
  secondaryNames: Array<string>;
};

export type IVolunteerSearchReducer = {
  fullName: string;
  active: boolean | undefined;
  countries: Array<string>;
  states: Array<string>;
  cities: Array<string>;
  dateOfBirths: Array<string>;
  emails: Array<string>;
  dateOfJoins: Array<string>;
  beiChapters: Array<string>;
  volunteerRoles: Array<string>;
};

export type VolunteerSearchParams = {
  active?: boolean;
  name?: string;
  countries?: string[];
  states?: string[];
  cities?: string[];
  beiChapters?: string[];
  dateOfBirths?: string[];
  emails?: string[];
  dateOfJoins?: string[];
  approved?: AdminApprovalStatus[];
  roles?: Role[];
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
    | "imageLink"
  > {
  active: boolean;
}

export interface IVolunteerTableEntry extends IUser {
  startDate: string;
}

/* Chapter Search Types */
export interface IChapterTableEntry {
  name: string;
  chapterPresident: string;
  patients: number;
  activeVolunteers: number;
  inactiveVolunteers: number;
  yearFounded: number;
  active: boolean;
  location: {
    country: string;
    state: string;
    city: string;
  };
}

export type ChapterSearchParams = {
  name?: string;
};

/* Single Patient Analytics Types */

export interface IAggregatedAnalyticsAll
  extends IAggregatedAnalyticsOverall,
    IAggregatedAnalyticsMath,
    IAggregatedAnalyticsTrivia,
    IAggregatedAnalyticsReading,
    PatientStats,
    IAggregatedAnalyticsWriting {}

export interface IAggregatedAnalyticsOverall {
  overall: {
    active: boolean;
    streak: Days[];
    startDate: Date;
    lastSessionDate: Date;
    totalSessionsCompleted: number;
    streakHistory: DataRecord[];
    lastSession: {
      mathQuestionsCompleted: number;
      wordsRead: number;
      promptsCompleted: number;
      triviaQuestionsCompleted: number;
    };
    name: string;
  };
}

export interface IAggregatedAnalyticsMath {
  math: {
    avgAccuracy: DataRecord[];
    avgDifficultyScore: DataRecord[];
    avgQuestionsCompleted: DataRecord[];
    avgTimePerQuestion: DataRecord[];
    lastSession: {
      accuracy: number;
      difficultyScore: number;
      questionsCompleted: number;
      timePerQuestion: number;
    };
  };
}
export interface IAggregatedAnalyticsTrivia {
  trivia: {
    avgAccuracy: DataRecord[];
    avgQuestionsCompleted: DataRecord[];
    avgTimePerQuestion: DataRecord[];
    lastSession: {
      accuracy: number;
      questionsCompleted: number;
      timePerQuestion: number;
    };
  };
}
export interface IAggregatedAnalyticsReading {
  reading: {
    sessionCompletion: StackedDataRecord[];
    avgWordsPerMin: DataRecord[];
    avgPassagesRead: DataRecord[];
    avgTimePerPassage: DataRecord[];
    lastSession: {
      passagesRead: number;
      timePerPassage: number;
      completed: boolean;
    };
  };
}
export interface IAggregatedAnalyticsWriting {
  writing: {
    sessionCompletion: StackedDataRecord[];
    avgPromptsAnswered: DataRecord[];
    avgTimePerQuestion: DataRecord[];
    lastSession: {
      promptsAnswered: number;
      timePerPrompt: number;
      completed: boolean;
    };
  };
}

export interface IAggregatedOverallAnalytics {
  activeUsers: number;
  totalUsers: number;
  activeHistory: DataRecord[];
}

/* Group Patient Analytics Types */

export interface IAggregatedGroupAnalyticsAll
  extends IAggregatedGroupAnalyticsOverall,
    IAggregatedGroupAnalyticsMath,
    IAggregatedGroupAnalyticsReading,
    IAggregatedGroupAnalyticsWriting,
    PatientStats,
    IAggregatedGroupAnalyticsTrivia {}

export type IAggregatedGroupAnalyticsOverall = {
  overall: Omit<
    IAggregatedAnalyticsOverall["overall"],
    "name" | "streak" | "active" | "startDate" | "lastSessionDate"
  > & {
    totalUsers: number;
    activeUsers: number;
  };
};
export type IAggregatedGroupAnalyticsMath = IAggregatedAnalyticsMath;
export type IAggregatedGroupAnalyticsTrivia = IAggregatedAnalyticsTrivia;
export type IAggregatedGroupAnalyticsReading = {
  reading: Omit<IAggregatedAnalyticsReading["reading"], "lastSession"> & {
    lastSession: Omit<
      IAggregatedAnalyticsReading["reading"]["lastSession"],
      "completed"
    >;
  };
};
export type IAggregatedGroupAnalyticsWriting = {
  writing: Omit<IAggregatedAnalyticsWriting["writing"], "lastSession"> & {
    lastSession: Omit<
      IAggregatedAnalyticsWriting["writing"]["lastSession"],
      "completed"
    >;
  };
};

export interface PatientStats {
  totalPatients: number;
  activePatients: number;
}

export interface IGeneralReducer {
  pendingApprovals: number;
}

/* Chapter Interface */

export interface IChapter {
  name: string;
  chapterPresident: string;
  patients: number;
  activeVolunteers: number;
  inactiveVolunteers: number;
  yearFounded: number;
  active: boolean;
  location: {
    country: string;
    state: string;
    city: string;
  };
}

export type IChapterSearchReducer = {
  name: string;
};
