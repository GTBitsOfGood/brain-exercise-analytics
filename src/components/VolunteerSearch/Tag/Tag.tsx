import React, { useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Tag.module.css";

type TagProps<T> = {
  title: string;
  value: T;
  transformData?: (value: T) => string;
  onClick?: () => void;
  handleClose?: (value: T) => void;
};

export default function Tag<T>({
  title,
  value,
  onClick,
  handleClose,
  transformData,
}: TagProps<T>) {
  const [closeTag, setCloseTag] = useState(false);

  const handleCloseTag = () => {
    setCloseTag(true);
    if (handleClose) {
      handleClose(value);
    }
    if (onClick) {
      onClick();
    }
  };

  const tagText = transformData
    ? `${title}: ${transformData(value)}`
    : `${title}: ${String(value)}`;

  if (closeTag) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <span className={styles.text}>{tagText}</span>
        <div className={styles["icon-container"]} onClick={handleCloseTag}>
          <FontAwesomeIcon className={styles["x-icon"]} icon={faX} size="2xs" />
        </div>
      </div>
    </div>
  );
}
