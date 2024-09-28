"use client";

import { useMemo, useState, useCallback } from "react";
import { IChapter, IChapterTableEntry } from "@/common_utils/types";
import { SelectChangeEvent } from "@mui/material";
import ApplyDropdown, {
  DropdownOption,
} from "@src/components/Dropdown/ApplyDropdown/ApplyDropdown";
import { internalRequest } from "@src/utils/requests";
import {
  classes,
  getLowerAdminRoles,
  transformDate,
  transformPhoneNumber,
} from "@src/utils/utils";
import { RootState } from "@src/redux/rootReducer";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import styles from "./Row.module.css";
import Link from "next/link";

interface Props {
  chapter: IChapterTableEntry;
}

export function Row({ chapter }: Props) {
  const [view, setView] = useState<boolean>(false);
  const handleClick = useCallback(() => setView((v) => !v), []);
  const [updatedActive, setUpdatedActive] = useState(
    chapter.active,
  );

  // Role of the logged in user
  const currUserRole = useSelector(
    (rootState: RootState) => rootState.auth.role,
  );

  const chapterStatusOptions: DropdownOption<boolean>[] = [
    { value: true, displayValue: "Active" },
    { value: false, displayValue: "Inactive" },
  ];

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
            {chapter.volunteers}
          </div>
        </td>

        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>
            <ApplyDropdown
              options={chapterStatusOptions}
              value={updatedActive}
              showError={false}
              onChange={async (e: SelectChangeEvent<boolean>) => {
                const newActive = e.target.value as boolean;
                setUpdatedActive(newActive);
                // await internalRequest({
                //   url: "/api/volunteer",
                //   method: HttpMethod.PATCH,
                //   body: {
                //     email: volunteer.email,
                //     newFields: {
                //       "adminDetails.active": newActive,
                //     },
                //   },
                // });
              }}
              style={{
                borderRadius: 41,
                color: "#2B3674",
                backgroundColor: updatedActive ? "#D6F6EA" : "#FCDCE2",
                border: "none",
                width: "min-content",
                maxWidth: "100%",
                textAlign: "center",
                fontSize: "14px",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
              sx={{
                "&.MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderRadius: "41px",
                  },
                },
              }}
              menuItemStyle={{
                justifyContent: "left",
                fontSize: "14px",
                color: "#2B3674",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
              applyButtonStyle={{
                fontSize: "14px",
                color: "#2B3674",
                backgroundColor: "#E3EAFC",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
              categoryName="Status"
            />
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
