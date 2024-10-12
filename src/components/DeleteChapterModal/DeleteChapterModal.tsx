import { CSSProperties, FormEvent, MouseEvent, useState, useEffect } from "react";
import { classes } from "@src/utils/utils";

import styles from "./DeleteChapterModal.module.css";
import { internalRequest } from "@src/utils/requests";
import {
  HttpMethod,
  IChapter,
  IVolunteerTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";
import { DeleteReq } from "@src/app/api/chapter/route";
import { RootState } from "@src/redux/rootReducer";
import { useSelector } from "react-redux";
import { PatchReq } from "@src/app/api/volunteer/route"


interface Props {
  className?: string;
  style?: CSSProperties;
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
  setShowSuccessModal: Function;
  chapter: IChapter
}

const addChapterModal = ({ className, style, showModal, setShowModal, setShowSuccessModal, chapter}: Props) => {

  const [filteredUsers, setFilteredUsers] = useState<IVolunteerTableEntry[]>([]);
  const { fullName } = useSelector((state: RootState) => state.volunteerSearch);

  useEffect(() => {
    internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      url: "/api/volunteer/filter-volunteer",
      method: HttpMethod.POST,
      body: {
        params: {
          name: fullName,
          beiChapters: [chapter.name],
        },
        entriesPerPage: 9999,
      },
    }).then((res) => {
      setFilteredUsers(res?.data ?? []);
    })
  }, [])

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

      filteredUsers.forEach(async user => {
        await internalRequest<PatchReq>({
          url: "/api/volunteer",
          method: HttpMethod.PATCH,
          body: {
            email: user.email,
            newFields: {
              chapter: ""
            }
          }
        });
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
