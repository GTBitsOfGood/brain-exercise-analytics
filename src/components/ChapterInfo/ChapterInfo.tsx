import { IChapter } from "@/common_utils/types";
import { useMemo } from "react";
import styles from "./ChapterInfo.module.css";

import { Cell, CellProps } from "./Cell/Cell";

interface ChapterInfoProps {
  chapter: IChapter;
}

export default function ChapterInfo(params: ChapterInfoProps) {
  const chapterProfile = useMemo<CellProps[]>(() => {
    return [
      {
        title: "Chapter Size",
        value: `${params.chapter.volunteers}`,
        icon: <></>,
      },
      {
        title: "Active Volunteers",
        value: "0",
        icon: <></>,
      },
      {
        title: "Inactive Volunteers",
        value: "0",
        icon: <></>,
      },
      {
        title: "Patients",
        value: `${params.chapter.patients}`,
        icon: <></>,
      },
      {
        title: "Chapter President",
        value: `${params.chapter.chapterPresident}`,
        icon: <></>,
      },
      {
        title: "Year Founded",
        value: `${params.chapter.yearFounded}`,
        icon: <></>,
      },
      {
        title: "Chapter Region",
        value: `${params.chapter.location.state}, ${params.chapter.location.country}`,
        icon: <></>,
      },
    ] as CellProps[];
  }, [params.chapter]);

  const chapterManagement = useMemo<CellProps[]>(() => {
    return [
      {
        title: "Edit Chapter Profile",
        link: "",
        icon: <></>,
      },
      {
        title: "Chapter Transfer",
        link: "",
        icon: <></>,
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
        <div className={styles.chapterImage}></div>
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
