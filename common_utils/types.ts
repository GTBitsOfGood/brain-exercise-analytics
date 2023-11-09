export enum Role {
  NONPROFIT_ADMIN = "Nonprofit Admin",
  NONPROFIT_VOLUNTEER = "Nonprofit Volunteer",
  NONPROFIT_USER = "Nonprofit User",
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

export interface IUser {
  // the unqiue id assigned to a user. Let MongoDB create this when you insert a document
  // without any_id attribute
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  patientDetails: {
    birthdate: string;
    secondaryContactName: string;
    secondaryContactPhone: string;
  };
  location: {
    country: string;
    state: string;
    city: string;
  };
  signedUp: boolean;
  verified: boolean;
  role: Role;
}

export interface IVerificationLog {
  email: string;
  token: string;
  expiryDate: Date;
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

export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

/* VerificationLog MongoDB Schema Types */

export enum VerificationLogType {
  PASSWORD_RESET = "PASSWORD_RESET",
  EMAIL_VERIFICATION = "EMAIL_VERIFICATION",
}

/* Analytics Data */

export interface DataRecord {
  interval: string;
  value: number;
}

export interface StackedDataRecord extends DataRecord {
  stackedValue: number;
}
