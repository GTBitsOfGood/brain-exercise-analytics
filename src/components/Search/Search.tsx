"use client";

import React, { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Poppins } from "next/font/google";
import styles from "./Search.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const InputField = () => {
  const [searchInput, setSearchInput] = useState("");

  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <main className={poppins.variable}>
          <div className={styles["search-container"]}>
            <input
              className={styles["search-bar"]}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Name"
            />
          </div>
          <div className={styles["icon-container"]}>
            <FontAwesomeIcon
              className={styles["search-icon"]}
              icon={faSearch}
              size="lg"
              onClick={() => console.log(searchInput)}
            />
          </div>
          <div className={styles["text-container"]}>
            <span
              className={styles["advanced-filter"]}
              onClick={() => console.log("Advanced Filter clicked!")}
            >
              Advanced Filter
            </span>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InputField;
