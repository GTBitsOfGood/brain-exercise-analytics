import React from "react";
import styles from "./Pagination.module.css";
interface DataParams {
  totalUsers: number;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
}
const Pagination = (params: DataParams) => {
  let pages = [];
  const usersPerPage = 8;
  for (let i = 1; i <= Math.ceil(params.totalUsers / usersPerPage); i++) {
    if (i === 4 && params.pageCount > 7) {
      pages.push("...");
      i = params.pageCount - 2;
    } else {
      pages.push(i);
    }
  }

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
