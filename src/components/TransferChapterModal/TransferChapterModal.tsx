import { CSSProperties, FormEvent, MouseEvent, useState, useEffect } from "react";
import { classes } from "@src/utils/utils";
import { useSelector } from "react-redux";

import styles from "./TransferChapterModal.module.css";
import XIcon from "@/src/app/icons/XIcon"
import { RootState } from "@src/redux/rootReducer";
import { internalRequest } from "@src/utils/requests";
import {
  AdminApprovalStatus,
  HttpMethod,
  IChapter,
  IVolunteerTableEntry,
  SearchResponseBody,
} from "@/common_utils/types";
import { PatchReq } from "@src/app/api/chapter/route";
import {PatchReq as PatchReqUser} from "@src/app/api/volunteer/route"
import LiveSearchDropdown from "../LiveSearchDropdown/LiveSearchDropdown";
import { Role } from "@/common_utils/types";

interface Props {
  className?: string;
  style?: CSSProperties;
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
  setShowSuccessModal: Function;
  chapter: IChapter;
}

const editChapterModal = ({ className, style, showModal, setShowModal, setShowSuccessModal, chapter}: Props) => {

  const [currChapterPresident, setCurrChapterPresident] = useState<IVolunteerTableEntry[]>();

  const [chapterPresident, setChapterPresident] = useState<string>("");
  const [chapterPresidentError, setChapterPresidentError] = useState<string>("");
  const [chapterPresidentObject, setChapterPresidentObject] = useState<IVolunteerTableEntry>();
  
  const [volunteers, setVolunteers] = useState<IVolunteerTableEntry[]>();
  const [filteredVolunteers, setFilteredVolunteers] = useState<IVolunteerTableEntry[]>();
  const [loading, setLoading] = useState(false);

  const resetErrors = () => {
    setChapterPresidentError("");
  };

  const reset = () => {
    setChapterPresident("")
    console.log(currChapterPresident)
    resetErrors();
  };

    // Getting Volunteers
    const {
      fullName,
      volunteerRoles,
    } = useSelector((state: RootState) => state.volunteerSearch);
  
    useEffect(() => {
      // setLoading(true)
      // internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
      //   url: "/api/volunteer/internal/get-volunteer",
      //   method: HttpMethod.POST,
      //   body: {
      //     secret: ,
      //     id: chapter.chapterPresident
      //   },
      // }).then((res) => {
      //   setCurrChapterPresident(res?.data);
      // });

      internalRequest<SearchResponseBody<IVolunteerTableEntry>>({
        url: "/api/volunteer/filter-volunteer",
        method: HttpMethod.POST,
        body: {
          params: {
            name: fullName,
            roles: volunteerRoles,
            approved: [AdminApprovalStatus.APPROVED],
          },
          entriesPerPage: 9999,
        },
      }).then((res) => {
        setVolunteers(res?.data ?? []);
        setLoading(false)
      });

      
    }, []);

    type changeHandler = React.ChangeEventHandler<HTMLInputElement>;
    const handleChange: changeHandler = (e) => {
      const { target } = e;
      if (!target.value.trim()) return setFilteredVolunteers([]);
  
      const filteredValue = volunteers?.filter((volunteer) =>
        (volunteer.firstName + " " + volunteer.lastName).toLowerCase().startsWith(target.value.toLowerCase())
      );
      setFilteredVolunteers(filteredValue);
    };

  const handleSaveChanges = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    resetErrors();
    let error = false;

    if (chapterPresident === "") {
      setChapterPresidentError("Choose a chapter president");
      error = true;
    }

    if (error) {
      console.log(error);
      return;
    }

    try {
      await internalRequest<PatchReq>({
        url: "/api/chapter",
        method: HttpMethod.PATCH,
        body: {
          name: chapter.name,
          newFields: {
            chapterPresident: chapterPresidentObject?._id, 
          }
        }
      });

      // await internalRequest<PatchReqUser>({
      //   url: "/api/volunteer",
      //   method: HttpMethod.PATCH,
      //   body: {
      //     email: currChapterPresident?[0]?.email,
      //     newFields: {
      //       role: Role.NONPROFIT_VOLUNTEER
      //     }
      //   }
      // })

      await internalRequest<PatchReqUser>({
        url: "/api/volunteer",
        method: HttpMethod.PATCH,
        body: {
          email: chapterPresidentObject?.email,
          newFields: {
            chapter: chapter.name,
            role: Role.NONPROFIT_CHAPTER_PRESIDENT
          }
        }
      })

      setShowModal(false);
      reset();
      setShowSuccessModal(true);

    } catch (error) {
        console.log(error)
    }
  };

  return (
    <div className={classes(styles.container, className)} style={style}>
      <>
        <form className={styles.inputs} onSubmit={handleSaveChanges}>
          <div className={styles.inputHeader}>
            <label>Leadership Transfer</label>
          </div>
          <div className={styles.inputSubheader}>
            <label>{chapter.name}</label>
          </div>
          <div className={styles.text1}>You're transfering this chapter from:</div>
          <div className={styles.text2}>Current Chapter President</div>
          <div className={styles.currPresContainer}>
            <div className={styles.text2}>{}</div>
            <div>{chapter.chapterPresident}</div>
          </div>
          <div className={styles.text1}>To:</div>

          <div className={styles.inputField}>
            <label>New Chapter President</label>
            <LiveSearchDropdown
              options={filteredVolunteers}
              value={chapterPresident}
              setValue={setChapterPresident}
              placeholder={loading ? "Loading.." : "Enter the name of the chapter president"}
              renderItem={(item) => 
                <p className={styles.p}>{item.firstName + " " + item.lastName + "        " + item.phoneNumber}</p>}
              onChange={handleChange}
              onSelect={(item) => {
                setChapterPresident(item.firstName + " " + item.lastName)
                setChapterPresidentObject(item)}
              }
              showError={chapterPresidentError !== ""}
              error={chapterPresidentError}
            />
          </div>

          <div className={styles.buttons}>
            <button
              type="button"
              onClick={() => {
                reset()
                setShowModal(false)
              }}
              className={`${styles.submitButton} ${styles.disabled}`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              onClick={handleSaveChanges}
            >
              Confirm Chapter Transfer
            </button>
          </div>
        </form>
      </>
      <button className={styles.exit} onClick={() => setShowModal(false)}><XIcon></XIcon></button>
    </div>
  );
};

export default editChapterModal;
