import { useRouter } from "next/navigation";
import { CSSProperties, FormEvent, MouseEvent, useState } from "react";
import { classes } from "@src/utils/utils";

import useAuth from "@src/hooks/useAuth";
import styles from "./AddChapterModal.module.css";
import InputField from "../InputField/InputField";
import XIcon from "@/src/app/icons/XIcon"


interface Props {
  className?: string;
  style?: CSSProperties;
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
}

const Modal = ({ className, style, showModal, setShowModal}: Props) => {
  const [chapterName, setChapterName] = useState<string>("");
  const [chapterRegion, setChapterRegion] = useState<string>("");
  const [chapterPresident, setChapterPresident] = useState<string>("");

  const [chapterNameError, setChapterNameError] = useState<string>("");
  const [chapterRegionError, setChapterRegionError] = useState<string>("");
  const [chapterPresidentError, setChapterPresidentError] = useState<string>("");

  const resetErrors = () => {
    setChapterNameError("");
    setChapterRegionError("");
    setChapterPresidentError("");
  };

  const reset = () => {
    setChapterName("");
    setChapterRegion("");
    setChapterPresident("");
    resetErrors();
  };

  const handleSaveChanges = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    resetErrors();
    let error = false;
    if (chapterName === "") {
      setChapterNameError("Chapter name cannot be blank");
      error = true;
    }
    if (chapterRegion === "") {
      setChapterRegionError("Chapter region cannot be blank");
      error = true;
    }
    if (chapterPresident === "") {
      setChapterPresidentError("Chapter president cannot be blank");
      error = true;
    }

    if (error) {
      return;
    }
    reset();
  };

  return (
    <div className={classes(styles.container, className)} style={style}>
      <>
        <form className={styles.inputs} onSubmit={handleSaveChanges}>
          <div className={styles.inputHeader}>
            <label>Add a New Chapter</label>
          </div>
          <div className={styles.inputField}>
            <label>Chapter Name</label>
            <InputField
              placeholder="Enter a chapter name"
              value={chapterName}
              onChange={(e) => setChapterName(e.target.value)}
              showError={chapterNameError !== ""}
              error={chapterNameError}
            />
          </div>
          <div className={styles.inputField}>
            <label>Chapter Region</label>
            <InputField
              placeholder="Enter chapter region"
              value={chapterRegion}
              onChange={(e) => setChapterRegion(e.target.value)}
              showError={chapterRegionError !== ""}
              error={chapterRegionError}
            />
          </div>

          <div className={styles.inputField}>
            <label>Chapter President</label>
            <InputField
              placeholder="Enter the name of the chapter president"
              value={chapterPresident}
              onChange={(e) => setChapterPresident(e.target.value)}
              showError={chapterPresidentError !== ""}
              error={chapterPresidentError}
            />
          </div>
          <div className={styles.buttons}>
            <button
              type="button"
              onClick={reset}
              className={`${styles.submitButton} ${styles.disabled}`}
            >
              Discard
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              onClick={handleSaveChanges}
            >
              Confirm
            </button>
          </div>
        </form>
      </>
      <button className={styles.exit} onClick={() => setShowModal(false)}><XIcon></XIcon></button>
    </div>
  );
};

export default Modal;
