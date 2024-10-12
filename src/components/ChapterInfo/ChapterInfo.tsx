import {
  faUser,
  faUsers,
  faPerson,
  faAddressCard,
  faLocationDot,
  faCalendar,
  faPlus,
  faWrench,
  faHandHoldingHand,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IChapter } from "@/common_utils/types";
import { useMemo, useState } from "react";
import styles from "./ChapterInfo.module.css";
import EditChapterModal from "@src/components/EditChapterModal/EditChapterModal";
import OperationSuccessModal from "@src/components/OperationSuccessModal/OperationSuccessModal";
import Modal from "@src/components/Modal/Modal";

import { Cell, CellProps } from "./Cell/Cell";

interface ChapterInfoProps {
  chapter: IChapter;
}

export default function ChapterInfo(params: ChapterInfoProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successLink, setSuccessLink] = useState<string>("");

  const chapterProfile = useMemo<CellProps[]>(() => {
    
    return [
      {
        title: "Chapter Size",
        value: `${params.chapter.patients}`,
        icon: <FontAwesomeIcon icon={faUsers} style={{ color: "#008afc" }} />,
      },
      {
        title: "Active Volunteers",
        value: "0",
        icon: <FontAwesomeIcon icon={faUser} style={{ color: "#008afc" }} />,
      },
      {
        title: "Inactive Volunteers",
        value: "0",
        icon: <FontAwesomeIcon icon={faUser} style={{ color: "#9CA5C2" }} />,
      },
      {
        title: "Patients",
        value: `${params.chapter.patients}`,
        icon: <FontAwesomeIcon icon={faPerson} style={{ color: "#008afc" }} />,
      },
      {
        title: "Chapter President",
        value: `${params.chapter.chapterPresident}`,
        icon: (
          <FontAwesomeIcon icon={faAddressCard} style={{ color: "#008afc" }} />
        ),
      },
      {
        title: "Year Founded",
        value: `${params.chapter.yearFounded}`,
        icon: (
          <FontAwesomeIcon icon={faCalendar} style={{ color: "#008afc" }} />
        ),
      },
      {
        title: "Chapter Region",
        value: `${params.chapter.location.state}, ${params.chapter.location.country}`,
        icon: (
          <FontAwesomeIcon icon={faLocationDot} style={{ color: "#008afc" }} />
        ),
      },
    ] as CellProps[];
  }, [params.chapter]);

  const chapterManagement = useMemo<CellProps[]>(() => {
    return [
      {
        title: "Edit Chapter Profile",
        link: () => setShowModal(true),
        icon: <FontAwesomeIcon icon={faWrench} style={{ color: "#008afc" }} />,
      },
      {
        title: "Chapter Transfer",
        link: "test",
        icon: (
          <FontAwesomeIcon
            icon={faHandHoldingHand}
            style={{ color: "#008afc" }}
          />
        ),
      },
    ] as CellProps[];
  }, [params.chapter]);

  return (
    <div>
      <div className={styles.chapterInfoHeading}>
        <p>{`${params.chapter.name} Chapter`}</p>
      </div>
      <div className={styles.chapterInfoSubheading}>
        <p>Chapter Profile</p>
      </div>
      <div className={styles.chapterSection}>
        <div className={styles.chapterImage}>
          <Cell
            cell={{
              title: "Add Chapter Image",
              icon: (
                <FontAwesomeIcon icon={faPlus} style={{ color: "#ffffff" }} />
              ),
              cellStyle: { height: "100%", width: "225px" },
              iconStyle: { backgroundColor: "#008afc" },
            }}
          />
        </div>
        <div className={styles.chapterInfo}>
          {chapterProfile.map((cell) => (
            <Cell key={cell.title} cell={cell} />
          ))}
        </div>
      </div>
      <div className={styles.chapterInfoSubheading}>
        <p>Chapter Management</p>
      </div>
      <div className={styles.chapterSection}>
        <div className={styles.chapterInfo}>
          {chapterManagement.map((cell) => (
            <Cell key={cell.title} cell={cell} />
          ))}
        </div>
      </div>
      <Modal showModal={showModal} setShowModal={setShowModal}>
      <EditChapterModal className={styles.editChapterModalContent} 
          showModal={showModal} setShowModal={setShowModal} setShowSuccessModal={setShowSuccessModal} 
          setSuccessLink={setSuccessLink} chapter={params.chapter}
          />
      </Modal>
      <Modal showModal={showSuccessModal} setShowModal={setShowSuccessModal} link={successLink}>
        <OperationSuccessModal className={styles.operationSuccessModal} 
          showModal={showSuccessModal} setShowModal={setShowSuccessModal}
          subtitle="Chapter Profile has been successfully edited"/>
      </Modal>
    </div>
  );
}
