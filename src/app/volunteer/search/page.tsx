"use client";

import React from "react";
import VolunteerGrid from "@src/components/VolunteerGrid/VolunteerGrid";
import styles from "./page.module.css";

const tableData = [
  {
    id: 1,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 2,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: false,
  },
  {
    id: 3,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 4,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 5,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 6,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 7,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 8,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 9,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 10,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 11,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 12,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 13,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 14,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 15,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 16,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 17,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
  {
    id: 18,
    name: "Name",
    title: "Volunteer",
    dateJoined: "MM/DD/YY",
    status: true,
  },
];

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <VolunteerGrid
        data={tableData}
        // sortField={sortField}
        // setSortField={setSortField}
        // setCurrentPage={setCurrentPage}
        // pageCount={pageCount}
        // currentPage={currentPage}
      />
    </div>
  );
}
