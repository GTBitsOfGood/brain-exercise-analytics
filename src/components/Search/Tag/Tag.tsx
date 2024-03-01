import React, { Dispatch, SetStateAction, useState } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Tag.module.css";

type TagProps<T> = {
  title: string;
  value: T;
  setList?: Dispatch<SetStateAction<Set<T>>>;
  transformData?: (value: T) => string;
  onClick?: () => void;
};

export default function Tag<T>({
  title,
  value,
  setList,
  transformData,
  onClick,
}: TagProps<T>) {
  const [closeTag, setCloseTag] = useState(false);

  const handleCloseTag = () => {
    setCloseTag(true);
    if (setList) {
      setList((list) => {
        const newList = new Set<T>(list);
        newList.delete(value);
        return newList;
      });
    }
    if (onClick) {
      onClick();
    }
  };

  let tagText = `${title}: `;

  if (transformData) {
    tagText += transformData(value);
  } else {
    tagText += value;
  }

  if (closeTag) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.border}>
        <span className={styles.text}>{tagText}</span>
        <FontAwesomeIcon
          className={styles["x-icon"]}
          icon={faX}
          onClick={handleCloseTag}
        />
      </div>
    </div>
  );
}
