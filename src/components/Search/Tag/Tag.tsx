import React, { useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Poppins } from "next/font/google";
import styles from "./Tag.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type TagProps = {
  title: string;
  value: string | boolean;
};

const Tag = (TagProps: TagProps) => {
  const [closeTag, setCloseTag] = useState(false);
  const { title } = TagProps;
  const { value } = TagProps;

  let tagText = `${title}: `;

  if (typeof value === "boolean") {
    tagText += value ? "Active" : "Not Active";
  } else {
    tagText += value;
  }

  return (
    !closeTag && (
      <main className={poppins.variable}>
        <div className={styles.container}>
          <div className={styles.border}>
            <span className={styles.text}>{tagText}</span>
            <div className={styles["icon-container"]}>
              <FontAwesomeIcon
                className={styles["x-icon"]}
                icon={faX}
                size="2xs"
                onClick={() => setCloseTag(true)}
              />
            </div>
          </div>
        </div>
      </main>
    )
  );
};

export default Tag;
