"use client";

import { useMemo, useState, useCallback } from "react";
import { HttpMethod, IUser, Role } from "@/common_utils/types";
import { SelectChangeEvent } from "@mui/material";
import Dropdown, { DropdownOption } from "@src/components/Dropdown/Dropdown";
import { internalRequest } from "@src/utils/requests";

import {
  getLowerAdminRoles,
  transformDate,
  transformPhoneNumber,
} from "@src/utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";
import CheckCircle from "@src/app/icons/CheckCircle";
import XCircle from "@src/app/icons/XCircle";
import ProfilePicIcon from "@src/app/icons/ProfilePicIcon";
import styles from "./Row.module.css";

interface Props {
  volunteer: IUser;
}

function ExpandedRow({ row }: { row: IUser }) {
  return (
    <tr>
      <td colSpan={8}>
        <div className={styles.ExpandedRowContainer}>
          <div className={styles.ExpandedRowColumn}>
            <ProfilePicIcon />
          </div>
          <div className={styles.ExpandedRowColumn}>
            <div className={styles.Header}>Profile Information</div>
            <div className={styles.DetailRow}>
              <div className={styles.Detail}>
                <span className={styles.Label}>Chapter</span>
                <span className={styles.Content}>{row.chapter}</span>
              </div>
              <div className={styles.Detail}>
                <span className={styles.Label}>Date Joined</span>
                <span className={styles.Content}>
                  {row.startDate.toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className={styles.DetailRow}>
              <div className={styles.Detail}>
                <span className={styles.Label}>Date of Birth</span>
                <span className={styles.Content}>
                  {row.birthDate.toLocaleDateString()}
                </span>
              </div>
              <div className={styles.Detail}>
                <span className={styles.Label}>Location</span>
                <span className={styles.Content}>{row.location.country}</span>
              </div>
            </div>
          </div>

          <div className={styles.ExpandedRowColumn}>
            <div className={styles.Header}>Contact Information</div>
            <div className={styles.Detail}>
              <span className={styles.Label}>Phone Number</span>
              <span className={styles.Content}>
                {transformPhoneNumber(row.phoneNumber)}
              </span>
            </div>
            <div className={styles.Detail}>
              <span className={styles.Label}>Email</span>
              <span className={styles.Content}>{row.email}</span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  );
}

export function Row({ volunteer }: Props) {
  const [view, setView] = useState<boolean>(false);
  const handleClick = useCallback(() => setView((v) => !v), []);
  // Role of user corresponding to the given row
  const [updatedRole, setUpdatedRole] = useState(volunteer.role);

  // Role of the logged in user
  const currUserRole = useSelector(
    (rootState: RootState) => rootState.auth.role,
  );

  const roleDropdownOptions: DropdownOption<Role>[] = useMemo(
    () =>
      getLowerAdminRoles(currUserRole).map((role) => ({
        value: role,
        displayValue: role.toString().substring(10),
      })),
    [currUserRole],
  );

  const handleAdminApproval = async (
    volunteerEmail: string,
    approvalStatus: boolean,
  ) => {
    await internalRequest({
      url: "/api/volunteer/auth/admin-approval",
      method: HttpMethod.POST,
      body: {
        approvedEmail: volunteerEmail,
        approved: approvalStatus,
      },
    });
  };

  return (
    <>
      <tr className={styles.row} key={volunteer._id}>
        <td className={styles.RowCell}>
          <button
            style={{
              rotate: view ? "90deg" : "0deg",
            }}
            onClick={handleClick}
          >
            <FontAwesomeIcon icon={faCaretRight} />
          </button>
        </td>
        <td className={styles.RowCell}>
          <div
            className={styles.RowCellContainer}
          >{`${volunteer.firstName} ${volunteer.lastName}`}</div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>
            {transformDate(volunteer.birthDate)}
          </div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.RowCellContainer}>
            <Dropdown
              className={styles.accessLevelContainer}
              options={roleDropdownOptions}
              value={updatedRole}
              showError={false}
              onChange={(e: SelectChangeEvent<Role>) => {
                setUpdatedRole(e.target.value as Role);
                // Make a request to update role on MongoDB
              }}
              style={{
                borderRadius: 41,
                color: "#2B3674",
                backgroundColor: "#E3EAFC",
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
                fontSize: "12px",
                color: "#2B3674",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            />
          </div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.actionsContainer}>
            <button
              className={styles.approveButton}
              onClick={() =>
                handleAdminApproval("volunteerEmail@email.com", true)
              }
            >
              <CheckCircle />
              Approve
            </button>
            <button
              className={styles.denyButton}
              onClick={() =>
                handleAdminApproval("volunteerEmail@email.com", false)
              }
            >
              <XCircle />
              Deny
            </button>
          </div>
        </td>
      </tr>
      {view && <ExpandedRow row={volunteer} />}
    </>
  );
}
