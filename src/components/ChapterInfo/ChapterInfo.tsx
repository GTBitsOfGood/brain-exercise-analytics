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

import Modal from "@src/components/Modal/Modal";
import EditChapterModal from "@src/components/EditChapterModal/EditChapterModal";
import DeleteChapterModal from "@src/components/DeleteChapterModal/DeleteChapterModal";
import OperationSuccessModal from "@src/components/OperationSuccessModal/OperationSuccessModal";

import PersonPlusIcon from "@src/app/icons/PersonPlusIcon";
import RedTrashCan from "@src/app/icons/RedTrashCan";

import { Cell, CellProps } from "./Cell/Cell";
import AddVolunteerModal from "../AddVolunteerModal/AddVolunteerModal";
import TransferChapterModal from "../TransferChapterModal/TransferChapterModal";
import styles from "./ChapterInfo.module.css";

interface ChapterInfoProps {
  chapter: IChapter;
}

export default function ChapterInfo(params: ChapterInfoProps) {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEditSuccessModal, setShowEditSuccessModal] = useState(false);
  const [editSuccessLink, setEditSuccessLink] = useState<string>("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false);

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showTransferSuccessModal, setShowTransferSuccessModal] =
    useState(false);

  const [showAddVolunteerModal, setShowAddVolunteerModal] = useState(false);

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
        link: () => setShowEditModal(true),
        icon: <FontAwesomeIcon icon={faWrench} style={{ color: "#008afc" }} />,
      },
      {
        title: "Chapter Transfer",
        link: () => setShowTransferModal(true),
        icon: (
          <FontAwesomeIcon
            icon={faHandHoldingHand}
            style={{ color: "#008afc" }}
          />
        ),
      },
      {
        title: "Add Volunteer",
        link: () => setShowAddVolunteerModal(true),
        icon: <PersonPlusIcon className=""></PersonPlusIcon>,
      },
      {
        title: "Delete Chapter",
        link: () => setShowDeleteModal(true),
        icon: <RedTrashCan></RedTrashCan>,
        iconStyle: { backgroundColor: "#FCDCE2" },
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
      <Modal showModal={showEditModal} setShowModal={setShowEditModal}>
        <EditChapterModal
          className={styles.editChapterModalContent}
          showModal={showEditModal}
          setShowModal={setShowEditModal}
          setShowSuccessModal={setShowEditSuccessModal}
          setSuccessLink={setEditSuccessLink}
          chapter={params.chapter}
        />
      </Modal>
      <Modal
        showModal={showEditSuccessModal}
        setShowModal={setShowEditSuccessModal}
        link={editSuccessLink}
      >
        <OperationSuccessModal
          className={styles.editOperationSuccessModal}
          showModal={showEditSuccessModal}
          setShowModal={setShowEditSuccessModal}
          subtitle="Chapter Profile has been successfully edited"
        />
      </Modal>

      <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
        <DeleteChapterModal
          className={styles.deleteChapterModalContent}
          showModal={showDeleteModal}
          setShowModal={setShowDeleteModal}
          setShowSuccessModal={setShowDeleteSuccessModal}
          chapter={params.chapter}
        />
      </Modal>
      <Modal
        showModal={showDeleteSuccessModal}
        setShowModal={setShowDeleteSuccessModal}
        link={"./search"}
      >
        <OperationSuccessModal
          className={styles.deleteOperationSuccessModal}
          showModal={showDeleteSuccessModal}
          setShowModal={setShowDeleteSuccessModal}
          title={params.chapter.name}
          subtitle="You have successfully deleted:"
        />
      </Modal>

      <Modal showModal={showTransferModal} setShowModal={setShowTransferModal}>
        <TransferChapterModal
          className={styles.transferChapterModalContent}
          showModal={showTransferModal}
          setShowModal={setShowTransferModal}
          setShowSuccessModal={setShowTransferSuccessModal}
          chapter={params.chapter}
        />
      </Modal>
      <Modal
        showModal={showTransferSuccessModal}
        setShowModal={setShowTransferSuccessModal}
        link={"./search"}
      >
        <OperationSuccessModal
          className={styles.transferOperationSuccessModal}
          showModal={showTransferSuccessModal}
          setShowModal={setShowTransferSuccessModal}
          subtitle="You have successfully transfered your Chapter President role"
        />
      </Modal>

      <Modal
        showModal={showAddVolunteerModal}
        setShowModal={setShowAddVolunteerModal}
      >
        <AddVolunteerModal
          className={styles.addVolunteerModalContent}
          showModal={showAddVolunteerModal}
          setShowModal={setShowAddVolunteerModal}
        />
      </Modal>
    </div>
  );
}
