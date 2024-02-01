import React from 'react';
import styles from "./Pagination.module.css";

const Pagination = ({
  totalUsers,
  currentPage,
  setCurrentPage,
  pageCount
}) => {
  let pages = [];
  const usersPerPage = 8;
  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pages.push(i);
  }

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className={styles.Container}>
      <button className={styles.pageButton} onClick={goToPreviousPage}>
        &lt;
      </button>
      <div className={styles.Container}>
        {pages.map((page, index) => {
          const isCurrentPage = page === currentPage + 1; 
          return (
            <button
              key={index}
              onClick={() => setCurrentPage(page - 1)}
              className={`${styles.pageButton} ${isCurrentPage ? styles.currentPage : ""}`}
            >
              {page}
            </button>
          );
        })}
      </div>
      <button className={styles.pageButton} onClick={goToNextPage}>
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
