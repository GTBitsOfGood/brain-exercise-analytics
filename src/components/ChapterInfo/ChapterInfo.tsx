import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  User,
  UsersThree,
  IdentificationCard,
  Person,
  CalendarHeartFill,
  LocationMarker,
  Wrench,
  HandTransferIcon,
} from "@src/app/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IChapter } from "@/common_utils/types";
import { useMemo, useState } from "react";
import Modal from "@src/components/Modal/Modal";
import EditChapterModal from "@src/components/EditChapterModal/EditChapterModal";
import DeleteChapterModal from "@src/components/DeleteChapterModal/DeleteChapterModal";
import OperationSuccessModal from "@src/components/OperationSuccessModal/OperationSuccessModal";

import PersonPlusIcon from "@src/app/icons/PersonPlusIcon";
import RedTrashCan from "@src/app/icons/RedTrashCan";
import BackIcon from "@src/app/icons/BackIcon";
import Link from "next/link";
import styles from "./ChapterInfo.module.css";
import { Cell, CellProps } from "./Cell/Cell";
import AddVolunteerModal from "../AddVolunteerModal/AddVolunteerModal";
import TransferChapterModal from "../TransferChapterModal/TransferChapterModal";

interface ChapterInfoProps {
  chapter: IChapter;
  chapterPresident: string;
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
        value: `${params.chapter.inactiveVolunteers + params.chapter.activeVolunteers}`,
        icon: <UsersThree />,
      },
      {
        title: "Active Volunteers",
        value: `${params.chapter.activeVolunteers}`,
        icon: <User />,
      },
      {
        title: "Inactive Volunteers",
        value: `${params.chapter.inactiveVolunteers}`,
        icon: <User fill="#9CA5C2" />,
      },
      {
        title: "Patients",
        value: `${params.chapter.patients}`,
        icon: <Person />,
      },
      {
        title: "Chapter President",
        value: `${params.chapterPresident}`,
        icon: <IdentificationCard />,
      },
      {
        title: "Year Founded",
        value: `${params.chapter.yearFounded}`,
        icon: <CalendarHeartFill />,
      },
      {
        title: "Chapter Region",
        value: `${params.chapter.location.state}, ${params.chapter.location.country}`,
        icon: <LocationMarker />,
      },
    ] as CellProps[];
  }, [params]);

  const chapterManagement = useMemo<CellProps[]>(() => {
    return [
      {
        title: "Edit Chapter Profile",
        link: () => setShowEditModal(true),
        icon: <Wrench />,
      },
      {
        title: "Chapter Transfer",
        link: () => setShowTransferModal(true),
        icon: <HandTransferIcon />,
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
      <div>
        <Link className={styles.backButton} href={`/chapter/search`}>
          <div className={styles.backToSearchIcon}>
            <BackIcon />
          </div>
          <span className={styles.backToSearchText}>Back to Search</span>
        </Link>
      </div>
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
          subtitle="Chapter Profile has been successfully edited"
        />
      </Modal>

      <Modal showModal={showDeleteModal} setShowModal={setShowDeleteModal}>
        <DeleteChapterModal
          className={styles.deleteChapterModalContent}
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
          title={params.chapter.name}
          subtitle="You have successfully deleted:"
        />
      </Modal>

      <Modal showModal={showTransferModal} setShowModal={setShowTransferModal}>
        <TransferChapterModal
          className={styles.transferChapterModalContent}
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
          subtitle="You have successfully transfered your Chapter President role"
        />
      </Modal>

      <Modal
        showModal={showAddVolunteerModal}
        setShowModal={setShowAddVolunteerModal}
      >
        <AddVolunteerModal
          className={styles.addVolunteerModalContent}
          setShowModal={setShowAddVolunteerModal}
        />
      </Modal>
    </div>
  );
}
