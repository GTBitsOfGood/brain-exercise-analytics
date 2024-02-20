"use client";

import React from "react";
import VolunteerApprovalGrid from "@src/components/VolunteerApprovalGrid/VolunteerApprovalGrid";
import styles from "./page.module.css";

const tableData = [
  {
    id: 1,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 2,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 3,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 4,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 5,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 6,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 7,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 8,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 9,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 10,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 11,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 12,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 13,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 14,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 15,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 16,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 17,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
  {
    id: 18,
    name: "Name",
    title: "Volunteer",
    dateRequested: "MM/DD/YY",
    status: true,
  },
];

export default function Page() {
  return (
    <div className={styles.wrapper}>
      <VolunteerApprovalGrid data={tableData} />
    </div>
  );
}
