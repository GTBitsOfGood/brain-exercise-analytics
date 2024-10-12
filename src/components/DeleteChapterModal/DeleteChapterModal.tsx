import { CSSProperties, FormEvent, MouseEvent, useState, useEffect } from "react";
import { classes } from "@src/utils/utils";

import styles from "./DeleteChapterModal.module.css";
import { internalRequest } from "@src/utils/requests";
import {
  HttpMethod,
  IChapter,
} from "@/common_utils/types";
import { DeleteReq } from "@src/app/api/chapter/route";

interface Props {
  className?: string;
  style?: CSSProperties;
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
  setShowSuccessModal: Function;
  chapter: IChapter
}

const addChapterModal = ({ className, style, showModal, setShowModal, setShowSuccessModal, chapter}: Props) => {

  const handleSaveChanges = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
  
    try {
      await internalRequest<DeleteReq>({
        url: "/api/chapter",
        method: HttpMethod.DELETE,
        body: {
          name: chapter.name,
        },
      });

      setShowModal(false);
      setShowSuccessModal(true);

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className={classes(styles.container, className)} style={style}>
      <>
        <form>
          <div className={styles.inputHeader}>
            Delete Chapter
          </div>
          <div className={styles.description}>
            Please confirm that you want to delete this chapter. This action cannot be undone.
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`${styles.submitButton} ${styles.disabled}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              onClick={handleSaveChanges}
            >
              Delete
            </button>
          </div>
        </form>
      </>
    </div>
  );
};

export default addChapterModal;
