import React, { useMemo } from "react";
import styles from "./Pagination.module.css";

interface DataParams {
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
}

const Pagination = (params: DataParams) => {
  const pages = useMemo(() => {
    const forwardPages: number[] = [];
    for (
      let i = params.currentPage + 1;
      i <= params.pageCount && forwardPages.length !== 4;
      i += 1
    ) {
      forwardPages.push(i);
    }

    const backwardPages = [];
    if (forwardPages.length !== 4) {
      for (
        let i = params.currentPage;
        i > 0 && backwardPages.length !== 4 - forwardPages.length;
        i -= 1
      ) {
        backwardPages.push(i);
      }
      backwardPages.reverse();
    }
    return [...backwardPages, ...forwardPages];
  }, [params.currentPage, params.pageCount]);

  const goToPreviousPage = () => {
    if (params.currentPage > 0) {
      params.setCurrentPage(params.currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (params.currentPage < params.pageCount - 1) {
      params.setCurrentPage(params.currentPage + 1);
    }
  };
  if (pages.length === 0) {
    return null;
  }
  return (
    <div
      className={`${styles.Container} ${params.currentPage === 0 || params.currentPage === pages.length - 1 ? styles.boundary : ""}`}
    >
      <button
        className={`${styles.pageButton} ${params.currentPage + 1 === 1 ? styles.atLimit : ""}`}
        onClick={goToPreviousPage}
      >
        &lt;
      </button>
      <div className={styles.Container}>
        {pages.map((page, index) => {
          const isCurrentPage = page === params.currentPage + 1;
          return (
            <button
              key={index}
              onClick={() => params.setCurrentPage(Number(page) - 1)}
              className={`${styles.pageButton} ${isCurrentPage ? styles.currentPage : ""}`}
            >
              {page}
            </button>
          );
        })}
      </div>
      <button
        className={`${styles.pageButton} ${params.currentPage + 1 === pages[pages.length - 1] ? styles.atLimit : ""}`}
        onClick={goToNextPage}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
