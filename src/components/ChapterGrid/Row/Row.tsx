"use client";

import { IChapterTableEntry } from "@/common_utils/types";
import { SelectChangeEvent } from "@mui/material";
import { classes } from "@src/utils/utils";

import Link from "next/link";
import styles from "./Row.module.css";

interface Props {
  chapter: IChapterTableEntry;
}

export function Row({ chapter }: Props) {
  // const [updatedActive, setUpdatedActive] = useState(chapter.active);

  // const chapterStatusOptions: DropdownOption<boolean>[] = [
  //   { value: true, displayValue: "Active" },
  //   { value: false, displayValue: "Inactive" },
  // ];

  return (
    <>
      <tr className={styles.row} key={chapter.name}>
        <td className={styles.RowCell}>
          <div
            className={classes(
              styles.RowCellContainer,
              styles.nameCellContainer,
            )}
          >
            {chapter.name}
          </div>
        </td>

        <td className={styles.RowCell}>
          <div
            className={classes(
              styles.RowCellContainer,
              styles.nameCellContainer,
            )}
          >
            {`${chapter.location.state}, ${chapter.location.country}`}
          </div>
        </td>

        <td className={styles.RowCell}>
          <div
            className={classes(
              styles.RowCellContainer,
              styles.dateCellContainer,
            )}
          >
            {chapter.yearFounded}
          </div>
        </td>

        <td className={styles.RowCell}>
          <div
            className={classes(
              styles.RowCellContainer,
              styles.nameCellContainer,
            )}
          >
            {chapter.activeVolunteers + chapter.inactiveVolunteers}
          </div>
        </td>

        <td className={styles.RowCell}>
          <div
            className={classes(
              styles.RowCellContainer,
              styles.nameCellContainer,
            )}
          >
            {chapter.patients}
          </div>
        </td>

        <td>
          <Link
            className={styles.DatabaseButton}
            href={`/chapter/${chapter.name}`}
          >
            View Profile
          </Link>
        </td>
      </tr>
    </>
  );
}
