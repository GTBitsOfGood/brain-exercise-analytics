// import {
//   AdminApprovalStatus,
//   IChapter,
//   IPatientTableEntry,
//   IUser,
//   Role,
// } from "@/common_utils/types";

// export const sampleTableEntries: IPatientTableEntry[] = [
//   {
//     _id: "1",
//     firstName: "John",
//     lastName: "Doe",
//     birthDate: new Date("1990-01-01").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Jane Doe",
//       secondaryContactPhone: "5552221515",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: true,
//     email: "john.doe@example.com",
//     chapter: "Georgia Tech",
//     location: {
//       country: "USA",
//       state: "California",
//       city: "Los Angeles",
//     },
//     startDate: new Date("2020-05-05").toLocaleDateString(),
//   },
//   {
//     _id: "2",
//     firstName: "Jane",
//     lastName: "Smith",
//     birthDate: new Date("1992-02-02").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Ella Smith",
//       secondaryContactPhone: "5553347890",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: true,
//     email: "jane.smith@example.com",
//     chapter: "Georgia Tech",
//     location: {
//       country: "Canada",
//       state: "Ontario",
//       city: "Toronto",
//     },
//     startDate: new Date("2021-01-10").toLocaleDateString(),
//   },
//   {
//     _id: "3",
//     firstName: "Alice",
//     lastName: "Johnson",
//     birthDate: new Date("1985-03-03").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Michael Johnson",
//       secondaryContactPhone: "5554567890",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: false,
//     email: "alice.johnson@example.com",
//     chapter: "Georgia Tech",
//     location: {
//       country: "UK",
//       state: "England",
//       city: "London",
//     },
//     startDate: new Date("2021-02-20").toLocaleDateString(),
//   },
//   {
//     _id: "4",
//     firstName: "Bob",
//     lastName: "Brown",
//     birthDate: new Date("1987-04-04").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Linda Brown",
//       secondaryContactPhone: "5555678901",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: true,
//     email: "bob.brown@example.com",
//     chapter: "Johns Hopkins University",
//     location: {
//       country: "Australia",
//       state: "New South Wales",
//       city: "Sydney",
//     },
//     startDate: new Date("2021-03-15").toLocaleDateString(),
//   },
//   {
//     _id: "5",
//     firstName: "Charlie",
//     lastName: "Davis",
//     birthDate: new Date("1995-05-05").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Sarah Davis",
//       secondaryContactPhone: "5556789012",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: false,
//     email: "charlie.davis@example.com",
//     chapter: "University of Pennsylvania",
//     location: {
//       country: "India",
//       state: "Maharashtra",
//       city: "Mumbai",
//     },
//     startDate: new Date("2021-04-22").toLocaleDateString(),
//   },
//   {
//     _id: "6",
//     firstName: "Diana",
//     lastName: "Evans",
//     birthDate: new Date("1980-06-06").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Peter Evans",
//       secondaryContactPhone: "5557890123",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: true,
//     email: "diana.evans@example.com",
//     chapter: "Harvard University",
//     location: {
//       country: "Brazil",
//       state: "Rio de Janeiro",
//       city: "Rio de Janeiro",
//     },
//     startDate: new Date("2021-05-30").toLocaleDateString(),
//   },
//   {
//     _id: "7",
//     firstName: "Evan",
//     lastName: "Foster",
//     birthDate: new Date("1988-07-07").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Julia Foster",
//       secondaryContactPhone: "5558901234",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: false,
//     email: "evan.foster@example.com",
//     chapter: "Columbia University",
//     location: {
//       country: "Germany",
//       state: "Bavaria",
//       city: "Munich",
//     },
//     startDate: new Date("2021-07-14").toLocaleDateString(),
//   },
//   {
//     _id: "8",
//     firstName: "Fiona",
//     lastName: "Green",
//     birthDate: new Date("1993-08-08").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Mark Green",
//       secondaryContactPhone: "5559012345",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: true,
//     email: "fiona.green@example.com",
//     chapter: "Maryland",
//     location: {
//       country: "South Africa",
//       state: "Gauteng",
//       city: "Johannesburg",
//     },
//     startDate: new Date("2021-08-28").toLocaleDateString(),
//   },
//   {
//     _id: "9",
//     firstName: "George",
//     lastName: "Harris",
//     birthDate: new Date("1975-09-09").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Lucy Harris",
//       secondaryContactPhone: "5550123456",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: true,
//     email: "george.harris@example.com",
//     chapter: "Maryland",
//     location: {
//       country: "Japan",
//       state: "Tokyo",
//       city: "Tokyo",
//     },
//     startDate: new Date("2021-09-12").toLocaleDateString(),
//   },
//   {
//     _id: "10",
//     firstName: "Hannah",
//     lastName: "Adams",
//     birthDate: new Date("1997-10-10").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Oliver Adams",
//       secondaryContactPhone: "5551234567",
//       additionalAffiliation: "Patient visits Florida chapter every Tuesday",
//     },
//     active: false,
//     email: "hannah.adams@example.com",
//     chapter: "Maryland",
//     location: {
//       country: "New Zealand",
//       state: "Wellington",
//       city: "Wellington",
//     },
//     startDate: new Date("2021-10-05").toLocaleDateString(),
//   },
//   {
//     _id: "11",
//     firstName: "David",
//     lastName: "Johnson",
//     birthDate: new Date("1993-08-12").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Emma Johnson",
//       secondaryContactPhone: "5558901234",
//       additionalAffiliation: "Patient attends health workshops regularly",
//     },
//     active: true,
//     email: "Maryland",
//     chapter: "New York Medical Society",
//     location: {
//       country: "USA",
//       state: "New York",
//       city: "New York City",
//     },

//     startDate: new Date("2021-05-20").toLocaleDateString(),
//   },
//   {
//     _id: "12",
//     firstName: "Sophie",
//     lastName: "Brown",
//     birthDate: new Date("1986-11-15").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Ryan Brown",
//       secondaryContactPhone: "5552345678",
//       additionalAffiliation: "Patient advocates for mental health awareness",
//     },
//     active: false,
//     email: "sophie.brown@example.com",
//     chapter: "University of Notre Dame",
//     location: {
//       country: "France",
//       state: "Île-de-France",
//       city: "Paris",
//     },
//     startDate: new Date("2021-06-10").toLocaleDateString(),
//   },
//   {
//     _id: "13",
//     firstName: "Oliver",
//     lastName: "White",
//     birthDate: new Date("1990-03-25").toLocaleDateString(),
//     patientDetails: {
//       secondaryContactName: "Ava White",
//       secondaryContactPhone: "5553456789",
//       additionalAffiliation: "Patient volunteers at local health clinics",
//     },
//     active: true,
//     email: "oliver.white@example.com",
//     chapter: "Michigan State University",
//     location: {
//       country: "Germany",
//       state: "Berlin",
//       city: "Berlin",
//     },
//     startDate: new Date("2021-07-15").toLocaleDateString(),
//   },
// ];

// const sampleChapterEntries = [
//   {
//     name: "Johns Hopkins University",
//     chapterPresident: "647f15c2c9a1b01234567890",
//     patients: 50,
//     activeVolunteers: 15,
//     inactiveVolunteers: 5,
//     yearFounded: 2010,
//     location: { country: "USA", state: "Maryland", city: "Baltimore" },
//   },
//   {
//     name: "NIH Post-bac in Rockville, Maryland",
//     chapterPresident: "647f15c2c9a1b01234567891",
//     patients: 30,
//     activeVolunteers: 10,
//     inactiveVolunteers: 2,
//     yearFounded: 2015,
//     location: { country: "USA", state: "Maryland", city: "Rockville" },
//   },
//   {
//     name: "University of Maryland",
//     chapterPresident: "647f15c2c9a1b01234567892",
//     patients: 40,
//     activeVolunteers: 20,
//     inactiveVolunteers: 4,
//     yearFounded: 2005,
//     location: { country: "USA", state: "Maryland", city: "College Park" },
//   },
//   {
//     name: "Washington and Lee University",
//     chapterPresident: "647f15c2c9a1b01234567893",
//     patients: 25,
//     activeVolunteers: 8,
//     inactiveVolunteers: 1,
//     yearFounded: 2000,
//     location: { country: "USA", state: "Virginia", city: "Lexington" },
//   },
//   {
//     name: "Purdue University",
//     chapterPresident: "647f15c2c9a1b01234567894",
//     patients: 60,
//     activeVolunteers: 25,
//     inactiveVolunteers: 5,
//     yearFounded: 2008,
//     location: { country: "USA", state: "Indiana", city: "West Lafayette" },
//   },
//   {
//     name: "University of Notre Dame",
//     chapterPresident: "647f15c2c9a1b01234567895",
//     patients: 45,
//     activeVolunteers: 18,
//     inactiveVolunteers: 3,
//     yearFounded: 2003,
//     location: { country: "USA", state: "Indiana", city: "Notre Dame" },
//   },
//   {
//     name: "Indiana University Bloomington",
//     chapterPresident: "647f15c2c9a1b01234567896",
//     patients: 35,
//     activeVolunteers: 12,
//     inactiveVolunteers: 4,
//     yearFounded: 2012,
//     location: { country: "USA", state: "Indiana", city: "Bloomington" },
//   },
//   {
//     name: "University of Michigan",
//     chapterPresident: "647f15c2c9a1b01234567897",
//     patients: 55,
//     activeVolunteers: 22,
//     inactiveVolunteers: 6,
//     yearFounded: 2011,
//     location: { country: "USA", state: "Michigan", city: "Ann Arbor" },
//   },
//   {
//     name: "Michigan State University",
//     chapterPresident: "647f15c2c9a1b01234567898",
//     patients: 50,
//     activeVolunteers: 20,
//     inactiveVolunteers: 5,
//     yearFounded: 2007,
//     location: { country: "USA", state: "Michigan", city: "East Lansing" },
//   },
//   {
//     name: "Oakland University",
//     chapterPresident: "647f15c2c9a1b01234567899",
//     patients: 30,
//     activeVolunteers: 10,
//     inactiveVolunteers: 3,
//     yearFounded: 2018,
//     location: { country: "USA", state: "Michigan", city: "Rochester" },
//   },
//   {
//     name: "Case Western Reserve University",
//     chapterPresident: "647f15c2c9a1b0123456789a",
//     patients: 45,
//     activeVolunteers: 17,
//     inactiveVolunteers: 4,
//     yearFounded: 2010,
//     location: { country: "USA", state: "Ohio", city: "Cleveland" },
//   },
//   {
//     name: "Wake Forest",
//     chapterPresident: "647f15c2c9a1b0123456789b",
//     patients: 25,
//     activeVolunteers: 9,
//     inactiveVolunteers: 2,
//     yearFounded: 2015,
//     location: {
//       country: "USA",
//       state: "North Carolina",
//       city: "Winston-Salem",
//     },
//   },
//   {
//     name: "Augusta University",
//     chapterPresident: "647f15c2c9a1b0123456789c",
//     patients: 20,
//     activeVolunteers: 7,
//     inactiveVolunteers: 2,
//     yearFounded: 2017,
//     location: { country: "USA", state: "Georgia", city: "Augusta" },
//   },
//   {
//     name: "Georgia Tech",
//     chapterPresident: "647f15c2c9a1b0123456789d",
//     patients: 75,
//     activeVolunteers: 30,
//     inactiveVolunteers: 8,
//     yearFounded: 2009,
//     location: { country: "USA", state: "Georgia", city: "Atlanta" },
//   },
//   {
//     name: "University of Tennessee",
//     chapterPresident: "647f15c2c9a1b0123456789e",
//     patients: 35,
//     activeVolunteers: 15,
//     inactiveVolunteers: 4,
//     yearFounded: 2013,
//     location: { country: "USA", state: "Tennessee", city: "Knoxville" },
//   },
//   {
//     name: "University of Georgia",
//     chapterPresident: "647f15c2c9a1b0123456789f",
//     patients: 40,
//     activeVolunteers: 16,
//     inactiveVolunteers: 5,
//     yearFounded: 2006,
//     location: { country: "USA", state: "Georgia", city: "Athens" },
//   },
//   {
//     name: "Emory University",
//     chapterPresident: "647f15c2c9a1b012345678a0",
//     patients: 50,
//     activeVolunteers: 20,
//     inactiveVolunteers: 6,
//     yearFounded: 2004,
//     location: { country: "USA", state: "Georgia", city: "Atlanta" },
//   },
//   {
//     name: "Denmark High School",
//     chapterPresident: "647f15c2c9a1b012345678a1",
//     patients: 15,
//     activeVolunteers: 5,
//     inactiveVolunteers: 1,
//     yearFounded: 2020,
//     location: { country: "USA", state: "Georgia", city: "Alpharetta" },
//   },
//   {
//     name: "Florida State University",
//     chapterPresident: "647f15c2c9a1b012345678a2",
//     patients: 45,
//     activeVolunteers: 18,
//     inactiveVolunteers: 4,
//     yearFounded: 2016,
//     location: { country: "USA", state: "Florida", city: "Tallahassee" },
//   },
//   {
//     name: "University of Miami",
//     chapterPresident: "647f15c2c9a1b012345678a3",
//     patients: 50,
//     activeVolunteers: 22,
//     inactiveVolunteers: 5,
//     yearFounded: 2011,
//     location: { country: "USA", state: "Florida", city: "Miami" },
//   },
//   {
//     name: "Florida Institute of Technology",
//     chapterPresident: "647f15c2c9a1b012345678a4",
//     patients: 35,
//     activeVolunteers: 12,
//     inactiveVolunteers: 3,
//     yearFounded: 2018,
//     location: { country: "USA", state: "Florida", city: "Melbourne" },
//   },
// ];

// export const dataLine = [
//   {
//     interval: "Aug 17",
//     value: 0.4,
//   },
//   {
//     interval: "Aug 17",
//     value: 0.2,
//   },
//   {
//     interval: "Aug 17",
//     value: 0.65,
//   },
//   {
//     interval: "Aug 17",
//     value: 0.25,
//   },
//   {
//     interval: "Aug 17",
//     value: 0.7,
//   },
//   {
//     interval: "Aug 17",
//     value: 0.55,
//   },
// ];

// export const dataBar = [
//   {
//     interval: "Aug 17",
//     value: 0,
//   },
//   {
//     interval: "Aug 17",
//     value: 2,
//   },
//   {
//     interval: "Aug 17",
//     value: 1,
//   },
//   {
//     interval: "Aug 17",
//     value: 6,
//   },
//   {
//     interval: "Aug 17",
//     value: 5,
//   },
//   {
//     interval: "Aug 17",
//     value: 7,
//   },
// ];
// export const dataStacked = [
//   {
//     interval: "Aug 17",
//     stackedValue: 0.3,
//     value: 0.5,
//   },
//   {
//     interval: "Aug 17",
//     stackedValue: 0.2,
//     value: 0.6,
//   },
//   {
//     interval: "Aug 17",
//     stackedValue: 0.2,
//     value: 0.7,
//   },
//   {
//     interval: "Aug 17",
//     stackedValue: 0.5,
//     value: 0.6,
//   },
//   {
//     interval: "Aug 17",
//     stackedValue: 0.2,
//     value: 0.5,
//   },
//   {
//     interval: "Aug 17",
//     stackedValue: 0.0,
//     value: 0.8,
//   },
// ];

// export const numberOfQuestionData = [
//   {
//     interval: "Aug 17",
//     value: 25,
//   },
//   {
//     interval: "Aug 17",
//     value: 30,
//   },
//   {
//     interval: "Aug 17",
//     value: 15,
//   },
//   {
//     interval: "Aug 17",
//     value: 10,
//   },
//   {
//     interval: "Aug 17",
//     value: 10,
//   },
//   {
//     interval: "10/25",
//     value: 8,
//   },
//   {
//     interval: "11/01",
//     value: 8,
//   },
// ];

// // export const sampleUsers: IUser[] = [].concat(
// //   ...Array(750).fill(null).map((_, fillIndex) =>
// //     sampleTableEntries.map((entry, entryIndex) => ({
// //       name: entry.name,
// //       email: `${entry.email}${fillIndex + 25}`, // Concatenate fillIndex and entryIndex
// //       phoneNumber: "1234567890",
// //       patientDetails: entry.patientDetails,
// //       adminDetails: { active: entry.active },
// //       chapter: entry.chapter,
// //       location: entry.location,
// //       signedUp: true,
// //       verified: true,
// //       approved: AdminApprovalStatus.APPROVED,
// //       role: Role.NONPROFIT_PATIENT,
// //     }))
// //   )
// // );

// // export const sampleUsers: IUser[] = sampleTableEntries.map((entry) => {
// //   return {
// //     // _id: entry._id,
// //     firstName: entry.firstName,
// //     lastName: entry.lastName,
// //     email: entry.email,
// //     phoneNumber: "1234567890",
// //     startDate: entry.startDate,
// //     birthDate: entry.birthDate,
// //     patientDetails: entry.patientDetails,
// //     adminDetails: { active: entry.active },
// //     chapter: entry.chapter,
// //     location: entry.location,
// //     signedUp: true,
// //     verified: true,
// //     approved: AdminApprovalStatus.APPROVED,
// //     role: Role.NONPROFIT_PATIENT,
// //     imageLink: "",
// //   };
// // });

// // export const sampleChapters: IChapter[] = sampleChapterEntries.map((entry) => {
// //   return {
// //     name: entry.name, // Assuming this is provided in sampleChapterEntries
// //     chapterPresident: entry.chapterPresident || "647f15c2c9a1b01234567890", // Default ObjectId if not provided
// //     patients: entry.patients || 0, // Default to 0 if not provided
// //     activeVolunteers: entry.activeVolunteers || 0, // Default to 0 if not provided
// //     inactiveVolunteers: entry.inactiveVolunteers || 0, // Default to 0 if not provided
// //     yearFounded: entry.yearFounded || new Date().getFullYear(), // Default to the current year
// //     location: entry.location || {
// //       // Default to an empty location object
// //       country: "",
// //       state: "",
// //       city: "",
// //     },
// //   };
// // });
