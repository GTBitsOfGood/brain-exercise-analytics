export enum Role {
  NONPROFIT_ADMIN = "Nonprofit Admin",
  NONPROFIT_USER = "Nonprofit User",
}

export interface IUser {
  // the unqiue id assigned to a user. Let MongoDB create this when you insert a document
  // without any_id attribute
  _id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  patientDetails: {
    signedUp: boolean;
    birthdate: string;
    secondaryContactName: string;
    secondaryContactPhone: string;
  };
  role: Role;
}

export interface SignupData {
  email: string;
  name: string;
  phoneNumber: string;
  birthDate: Date;
  secondaryContactName: string;
  secondaryContactPhone: string;
}
