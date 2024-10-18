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
import { useMemo } from "react";
import BackIcon from "@src/app/icons/BackIcon";
import Link from "next/link";
import styles from "./ChapterInfo.module.css";
import { Cell, CellProps } from "./Cell/Cell";

interface ChapterInfoProps {
  chapter: IChapter;
  chapterPresident: string;
}

export default function ChapterInfo(params: ChapterInfoProps) {
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
        link: "test",
        icon: <Wrench />,
      },
      {
        title: "Chapter Transfer",
        link: "test",
        icon: <HandTransferIcon />,
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
    </div>
  );
}
