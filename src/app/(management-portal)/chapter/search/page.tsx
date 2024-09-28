"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChapterSearch from "@src/components/ChapterSearch/ChapterSearch";
import ChapterGrid from "@src/components/ChapterGrid/ChapterGrid";
import { IChapter } from "@/common_utils/types";
import { classes } from "@src/utils/utils";
import { internalRequest } from "@src/utils/requests";
import {
  SortField,
  HttpMethod,
  IChapterTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import Modal from "@src/components/Modal/Modal";

import firebaseInit from "@src/firebase/config";

import { RootState } from "@src/redux/rootReducer";
import styles from "./page.module.css";

firebaseInit();

export default function Page() {
  const {
    name
  } = useSelector((state: RootState) => state.chapterSearch);

  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filteredChapters, setFilteredChapters] = useState<IChapterTableEntry[]>([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   setLoading(true);
  //   internalRequest<SearchResponseBody<IChapterTableEntry>>({
  //     url: "/api/chapter/filter-chapter",
  //     method: HttpMethod.POST,
  //     body: {
  //       params: {
  //         name: name
  //       },
  //       page: currentPage,
  //       sortParams: sortField,
  //     },
  //   }).then((res) => {
  //     setPageCount(res?.numPages ?? 0);
  //     setFilteredChapters(res?.data ?? []);
  //     setLoading(false);
  //   });
  // }, [
  //   name,
  //   sortField,
  //   currentPage,
  // ]);

  useEffect(() => {
    setCurrentPage(0);
  }, [
    name,
    sortField,
  ]);

  const testFilteredChapters: IChapterTableEntry[] = [{
    name: "Georgia Tech",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  },
  {
    name: "Rio de Janeiro Health Institute",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  }, {
    name: "Wellington Health Services",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  }, {
    name: "Toronto Central",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  }, {
    name: "London Health Sciences Center",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  }, {
    name: "Mumbai Health Forum",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  }, {
    name: "Bavarian Medical Society",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  }, {
    name: "Johannesburg Health Chapter",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  }, {
    name: "Tokyo Medical Association",
    chapterPresident: "Nithya Kasaraneni",
    patients: 22,
    volunteers: 130,
    yearFounded: 2018,
    active: true,
    location: {
      country: "USA",
      state: "Georgia",
      city: "Atlanta",
    }
  },
  ]

  return (
    <div className={styles.container}>
      <title>Chapter Search | Brain Exercise Initiative</title>
      <Modal
        showModal={loading}
        setShowModal={setLoading}
        style={{ backgroundColor: "#F4F7FEF0" }}
        disableBackgroundClick
      >
        <LoadingBox />
      </Modal>
      <div className={classes(styles["search-container"])}>
        <p className={styles["intro-text"]}>Search Chapter at BEI</p>
        <div className={styles["search-wrapper"]}>
          <ChapterSearch/>
        </div>
      </div>
      <div
        className={classes(
          styles["table-container"],
          styles["table-container-show"],
        )}
      >
        <ChapterGrid
          data={testFilteredChapters}
          sortField={sortField}
          setSortField={setSortField}
          setCurrentPage={setCurrentPage}
          pageCount={pageCount}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
}
