"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChapterInfo from "@src/components/ChapterInfo/ChapterInfo";
import VolunteerSearch from "@src/components/VolunteerSearch/VolunteerSearch";
import VolunteerGrid from "@src/components/VolunteerGrid/VolunteerGrid";
import Modal from "@src/components/Modal/Modal";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import { classes } from "@src/utils/utils";

import { internalRequest } from "@src/utils/requests";
import {
  SortField,
  HttpMethod,
  IVolunteerTableEntry,
  SearchResponseBody,
  IChapter,
  IUser,
} from "@/common_utils/types";

import firebaseInit from "@src/firebase/config";
import { RootState } from "@src/redux/rootReducer";
import styles from "./page.module.css";

firebaseInit();

const blankChapter: IChapter = {
  name: "",
  chapterPresident: "",
  patients: 0,
  activeVolunteers: 0,
  inactiveVolunteers: 0,
  yearFounded: 1999,
  active: true,
  location: {
    country: "",
    state: "",
    city: "",
  },
};

export function Divider({ id }: { id?: string }) {
  return (
    <div
      id={id}
      style={{
        width: "100%",
        height: "2px",
        backgroundColor: "#c8c8c8",
        margin: "4.2% 0",
      }}
    />
  );
}

export default function Page({ params }: { params: { name: string } }) {
  const [chapter, setChapterInfo] = useState<IChapter>(blankChapter);
  const { fullName } = useSelector((state: RootState) => state.volunteerSearch);

  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filteredUsers, setFilteredUsers] = useState<IVolunteerTableEntry[]>(
    [],
  );
  const [chapterPresident, setChapterPresident] = useState("");

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(() => {
    setLoading(true);
    internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      url: "/api/volunteer/filter-volunteer",
      method: HttpMethod.POST,
      body: {
        params: {
          name: fullName,
          beiChapters: [decodeURI(params.name)],
        },
        page: currentPage,
        sortParams: sortField,
      },
    }).then((res) => {
      setPageCount(res?.numPages ?? 0);
      setFilteredUsers(res?.data ?? []);
      setLoading(false);
    });
  }, [fullName, currentPage, sortField, params.name]);

  const fetchChapterAndPresident = useCallback(() => {
    setLoading(true);
    internalRequest<IChapter>({
      url: "/api/chapter",
      method: HttpMethod.GET,
      queryParams: {
        name: params.name,
      },
    }).then((res) => {
      setChapterInfo(res);
      internalRequest<IUser>({
        url: "/api/patient/get-patient",
        method: HttpMethod.GET,
        queryParams: {
          id: res.chapterPresident,
        },
      })
        .then((pres) => {
          setChapterPresident(`${pres.firstName} ${pres.lastName}`);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }, [params.name]);

  useEffect(() => {
    fetchChapterAndPresident();
  }, [fetchChapterAndPresident]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    setCurrentPage(0);
  }, [fullName, sortField]);

  return (
    <div className={styles.container}>
      <title>Chapter Page | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0" }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
      <div className={classes(styles["profile-container"])}>
        <ChapterInfo chapter={chapter} chapterPresident={chapterPresident} />
        <Divider />
      </div>
      <div className={classes(styles["search-container"])}>
        <div className={styles["search-wrapper"]}>
          <VolunteerSearch advancedSearch={false} />
        </div>
      </div>
      <div
        className={classes(
          styles["table-container"],
          styles["table-container-show"],
        )}
      >
        <VolunteerGrid
          data={filteredUsers}
          sortField={sortField}
          setSortField={setSortField}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
          currentPage={currentPage}
          refreshUsers={fetchUsers}
          chapter={decodeURI(params.name)}
        />
      </div>
    </div>
  );
}
