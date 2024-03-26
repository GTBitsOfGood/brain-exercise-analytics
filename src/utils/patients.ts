import {
  AdminApprovalStatus,
  IPatientTableEntry,
  IUser,
  Role,
} from "@/common_utils/types";

export const sampleTableEntries: IPatientTableEntry[] = [
  {
    _id: "1",
    firstName: "John",
    lastName: "Doe",
    birthDate: new Date("1990-01-01"),
    patientDetails: {
      secondaryContactName: "Jane Doe",
      secondaryContactPhone: "5552221515",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: true,
    email: "john.doe@example.com",
    chapter: "Georgia Institute of Technology",
    location: {
      country: "USA",
      state: "California",
      city: "Los Angeles",
    },
    startDate: new Date("2020-05-05"),
  },
  {
    _id: "2",
    firstName: "Jane",
    lastName: "Smith",
    birthDate: new Date("1992-02-02"),
    patientDetails: {
      secondaryContactName: "Ella Smith",
      secondaryContactPhone: "5553347890",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: true,
    email: "jane.smith@example.com",
    chapter: "Toronto Central",
    location: {
      country: "Canada",
      state: "Ontario",
      city: "Toronto",
    },
    startDate: new Date("2021-01-10"),
  },
  {
    _id: "3",
    firstName: "Alice",
    lastName: "Johnson",
    birthDate: new Date("1985-03-03"),
    patientDetails: {
      secondaryContactName: "Michael Johnson",
      secondaryContactPhone: "5554567890",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: false,
    email: "alice.johnson@example.com",
    chapter: "London Health Sciences Center",
    location: {
      country: "UK",
      state: "England",
      city: "London",
    },
    startDate: new Date("2021-02-20"),
  },
  {
    _id: "4",
    firstName: "Bob",
    lastName: "Brown",
    birthDate: new Date("1987-04-04"),
    patientDetails: {
      secondaryContactName: "Linda Brown",
      secondaryContactPhone: "5555678901",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: true,
    email: "bob.brown@example.com",
    chapter: "Sydney Medical Center",
    location: {
      country: "Australia",
      state: "New South Wales",
      city: "Sydney",
    },
    startDate: new Date("2021-03-15"),
  },
  {
    _id: "5",
    firstName: "Charlie",
    lastName: "Davis",
    birthDate: new Date("1995-05-05"),
    patientDetails: {
      secondaryContactName: "Sarah Davis",
      secondaryContactPhone: "5556789012",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: false,
    email: "charlie.davis@example.com",
    chapter: "Mumbai Health Forum",
    location: {
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
    },
    startDate: new Date("2021-04-22"),
  },
  {
    _id: "6",
    firstName: "Diana",
    lastName: "Evans",
    birthDate: new Date("1980-06-06"),
    patientDetails: {
      secondaryContactName: "Peter Evans",
      secondaryContactPhone: "5557890123",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: true,
    email: "diana.evans@example.com",
    chapter: "Rio de Janeiro Health Institute",
    location: {
      country: "Brazil",
      state: "Rio de Janeiro",
      city: "Rio de Janeiro",
    },
    startDate: new Date("2021-05-30"),
  },
  {
    _id: "7",
    firstName: "Evan",
    lastName: "Foster",
    birthDate: new Date("1988-07-07"),
    patientDetails: {
      secondaryContactName: "Julia Foster",
      secondaryContactPhone: "5558901234",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: false,
    email: "evan.foster@example.com",
    chapter: "Bavarian Medical Society",
    location: {
      country: "Germany",
      state: "Bavaria",
      city: "Munich",
    },
    startDate: new Date("2021-07-14"),
  },
  {
    _id: "8",
    firstName: "Fiona",
    lastName: "Green",
    birthDate: new Date("1993-08-08"),
    patientDetails: {
      secondaryContactName: "Mark Green",
      secondaryContactPhone: "5559012345",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: true,
    email: "fiona.green@example.com",
    chapter: "Johannesburg Health Chapter",
    location: {
      country: "South Africa",
      state: "Gauteng",
      city: "Johannesburg",
    },
    startDate: new Date("2021-08-28"),
  },
  {
    _id: "9",
    firstName: "George",
    lastName: "Harris",
    birthDate: new Date("1975-09-09"),
    patientDetails: {
      secondaryContactName: "Lucy Harris",
      secondaryContactPhone: "5550123456",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: true,
    email: "george.harris@example.com",
    chapter: "Tokyo Medical Association",
    location: {
      country: "Japan",
      state: "Tokyo",
      city: "Tokyo",
    },
    startDate: new Date("2021-09-12"),
  },
  {
    _id: "10",
    firstName: "Hannah",
    lastName: "Adams",
    birthDate: new Date("1997-10-10"),
    patientDetails: {
      secondaryContactName: "Oliver Adams",
      secondaryContactPhone: "5551234567",
      additionalAffiliation: "Patient visits Florida chapter every Tuesday",
    },
    active: false,
    email: "hannah.adams@example.com",
    chapter: "Wellington Health Services",
    location: {
      country: "New Zealand",
      state: "Wellington",
      city: "Wellington",
    },
    startDate: new Date("2021-10-05"),
  },
  {
    _id: "11",
    firstName: "David",
    lastName: "Johnson",
    birthDate: new Date("1993-08-12"),
    patientDetails: {
      secondaryContactName: "Emma Johnson",
      secondaryContactPhone: "5558901234",
      additionalAffiliation: "Patient attends health workshops regularly",
    },
    active: true,
    email: "david.johnson@example.com",
    chapter: "New York Medical Society",
    location: {
      country: "USA",
      state: "New York",
      city: "New York City",
    },

    startDate: new Date("2021-05-20"),
  },
  {
    _id: "12",
    firstName: "Sophie",
    lastName: "Brown",
    birthDate: new Date("1986-11-15"),
    patientDetails: {
      secondaryContactName: "Ryan Brown",
      secondaryContactPhone: "5552345678",
      additionalAffiliation: "Patient advocates for mental health awareness",
    },
    active: false,
    email: "sophie.brown@example.com",
    chapter: "Paris Health Institute",
    location: {
      country: "France",
      state: "Île-de-France",
      city: "Paris",
    },
    startDate: new Date("2021-06-10"),
  },
  {
    _id: "13",
    firstName: "Oliver",
    lastName: "White",
    birthDate: new Date("1990-03-25"),
    patientDetails: {
      secondaryContactName: "Ava White",
      secondaryContactPhone: "5553456789",
      additionalAffiliation: "Patient volunteers at local health clinics",
    },
    active: true,
    email: "oliver.white@example.com",
    chapter: "Berlin Medical Association",
    location: {
      country: "Germany",
      state: "Berlin",
      city: "Berlin",
    },
    startDate: new Date("2021-07-15"),
  },
];

export const dataLine = [
  {
    interval: "Aug 17",
    value: 0.4,
  },
  {
    interval: "Aug 17",
    value: 0.2,
  },
  {
    interval: "Aug 17",
    value: 0.65,
  },
  {
    interval: "Aug 17",
    value: 0.25,
  },
  {
    interval: "Aug 17",
    value: 0.7,
  },
  {
    interval: "Aug 17",
    value: 0.55,
  },
];

export const dataBar = [
  {
    interval: "Aug 17",
    value: 0,
  },
  {
    interval: "Aug 17",
    value: 2,
  },
  {
    interval: "Aug 17",
    value: 1,
  },
  {
    interval: "Aug 17",
    value: 6,
  },
  {
    interval: "Aug 17",
    value: 5,
  },
  {
    interval: "Aug 17",
    value: 7,
  },
];
export const dataStacked = [
  {
    interval: "Aug 17",
    stackedValue: 0.3,
    value: 0.5,
  },
  {
    interval: "Aug 17",
    stackedValue: 0.2,
    value: 0.6,
  },
  {
    interval: "Aug 17",
    stackedValue: 0.2,
    value: 0.7,
  },
  {
    interval: "Aug 17",
    stackedValue: 0.5,
    value: 0.6,
  },
  {
    interval: "Aug 17",
    stackedValue: 0.2,
    value: 0.5,
  },
  {
    interval: "Aug 17",
    stackedValue: 0.0,
    value: 0.8,
  },
];

export const numberOfQuestionData = [
  {
    interval: "Aug 17",
    value: 25,
  },
  {
    interval: "Aug 17",
    value: 30,
  },
  {
    interval: "Aug 17",
    value: 15,
  },
  {
    interval: "Aug 17",
    value: 10,
  },
  {
    interval: "Aug 17",
    value: 10,
  },
  {
    interval: "10/25",
    value: 8,
  },
  {
    interval: "11/01",
    value: 8,
  },
];

export const sampleUsers: IUser[] = sampleTableEntries.map((entry) => {
  return {
    _id: entry._id,
    firstName: entry.firstName,
    lastName: entry.lastName,
    email: entry.email,
    phoneNumber: "1234567890",
    startDate: entry.startDate,
    birthDate: entry.birthDate,
    patientDetails: entry.patientDetails,
    adminDetails: { active: entry.active },
    chapter: entry.chapter,
    location: entry.location,
    signedUp: true,
    verified: true,
    approved: AdminApprovalStatus.APPROVED,
    role: Role.NONPROFIT_PATIENT,
    imageLink: "",
  };
});
