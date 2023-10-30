"use client";

import React, { useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Poppins } from "next/font/google";
import styles from "./Search.module.css";
import Tag from "./Tag/Tag";

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
          <div className={styles["search-no-tags"]}>
            <div className={styles["search-container"]}>
              <input
                className={styles["search-bar"]}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Name"
              />
            </div>
            <FontAwesomeIcon
              className={styles["search-icon"]}
              icon={faSearch}
              size="lg"
              onClick={() => console.log(searchInput)} //eslint-disable-line
            />
            <span
              className={styles["advanced-filter"]}
              onClick={() => console.log("Advanced Filter clicked!")} //eslint-disable-line
            >
              Advanced Filter
            </span>
          </div>
          <div className={styles.tags}>
            <Tag title="Country" value="United States" />
            <Tag title="State" value="GA" />
            <Tag title="City" value="Atlanta" />
            <Tag title="Status" value={false} />
            <Tag title="BEI Chapter" value="Georgia Institute of Technology" />
            <Tag
              title="Additional Affiliation"
              value="The Content will be revised here......up to 70 words..."
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default InputField;
