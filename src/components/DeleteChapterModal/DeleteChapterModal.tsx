import {
  CSSProperties,
  FormEvent,
  MouseEvent,
  useState,
  useEffect,
} from "react";
import { classes } from "@src/utils/utils";

import { internalRequest } from "@src/utils/requests";
import {
  HttpMethod,
  IChapter,
  IUser,
  IVolunteerTableEntry,
  Role,
  SearchResponseBody,
} from "@/common_utils/types";
import { DeleteReq } from "@src/app/api/chapter/route";
import { PatchReq } from "@src/app/api/volunteer/route";
import { useRouter } from "next/navigation";
import styles from "./DeleteChapterModal.module.css";

interface Props {
  className?: string;
  style?: CSSProperties;
  setShowModal: (arg: boolean) => void;
  setShowSuccessModal: (arg: boolean) => void;
  chapter: IChapter;
}

const DeleteChapterModal = ({
  className,
  style,
  setShowModal,
  setShowSuccessModal,
  chapter,
}: Props) => {
  const router = useRouter();
  const [filteredUsers, setFilteredUsers] = useState<IVolunteerTableEntry[]>(
    [],
  );

  useEffect(() => {
    internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      url: "/api/volunteer/filter-volunteer",
      method: HttpMethod.POST,
      body: {
        params: {
          beiChapters: [chapter.name],
        },
        entriesPerPage: 9999,
        useAllRoles: true,
      },
    }).then((res) => {
      setFilteredUsers(res?.data ?? []);
    });
  }, []);

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

      filteredUsers.forEach(async (user) => {
        await internalRequest<PatchReq>({
          url: "/api/chapter/changeChapter",
          method: HttpMethod.PATCH,
          body: {
            email: user.email,
            chapter: "",
          },
        });
      });

      await internalRequest<IUser>({
        url: "/api/patient/get-patient",
        method: HttpMethod.GET,
        queryParams: {
          id: chapter.chapterPresident,
        },
      }).then(async (pres) => {
        internalRequest<IUser>({
          url: "/api/volunteer",
          method: HttpMethod.PATCH,
          body: {
            email: pres.email,
            newFields: {
              role: Role.NONPROFIT_VOLUNTEER,
            },
          },
        }).then(() => {
          router.push("/patient/search");
        });
      });

      setShowModal(false);
      setShowSuccessModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={classes(styles.container, className)} style={style}>
      <>
        <form>
          <div className={styles.inputHeader}>Delete Chapter</div>
          <div className={styles.description}>
            Please confirm that you want to delete this chapter and remove the
            Chapter President. This action cannot be undone.
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

export default DeleteChapterModal;
