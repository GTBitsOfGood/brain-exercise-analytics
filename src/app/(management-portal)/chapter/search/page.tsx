"use client";

import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ChapterSearch from "@src/components/ChapterSearch/ChapterSearch";
import ChapterGrid from "@src/components/ChapterGrid/ChapterGrid";
import {
  SortField,
  IChapterTableEntry,
  SearchResponseBody,
  HttpMethod,
} from "@/common_utils/types";
import { classes } from "@src/utils/utils";
import LoadingBox from "@src/components/LoadingBox/LoadingBox";
import Modal from "@src/components/Modal/Modal";

import firebaseInit from "@src/firebase/config";

import { RootState } from "@src/redux/rootReducer";
import { internalRequest } from "@src/utils/requests";
import styles from "./page.module.css";

firebaseInit();

export default function Page() {
  const { name } = useSelector((state: RootState) => state.chapterSearch);

  const [sortField, setSortField] = useState<SortField | undefined>(undefined);
  const [filteredChapters, setFilteredChapters] = useState<
    IChapterTableEntry[]
  >([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchChapters = useCallback(() => {
    setLoading(true);
    internalRequest<SearchResponseBody<IChapterTableEntry>>({
      url: "/api/chapter/search-chapter",
      method: HttpMethod.POST,
      body: {
        params: {
          name,
        },
        page: currentPage,
        sortParams: sortField,
      },
    }).then((res) => {
      setPageCount(res?.numPages ?? 0);
      setFilteredChapters(res?.data ?? []);
      setLoading(false);
    });
  }, [name, sortField, currentPage]);

  useEffect(() => {
    fetchChapters();
  }, [fetchChapters]);

  useEffect(() => {
    setCurrentPage(0);
  }, [name, sortField]);

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
          <ChapterSearch />
        </div>
      </div>
      <div
        className={classes(
          styles["table-container"],
          styles["table-container-show"],
        )}
      >
        <ChapterGrid
          data={filteredChapters}
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
