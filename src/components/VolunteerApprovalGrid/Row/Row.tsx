"use client";

import { useMemo, useState, useCallback } from "react";
import { HttpMethod, IUser, Role } from "@/common_utils/types";
import { SelectChangeEvent } from "@mui/material";
import ApplyDropdown, {
  DropdownOption,
} from "@src/components/Dropdown/ApplyDropdown/ApplyDropdown";
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
  refreshUsers: () => void;
}

function ExpandedRow({ row }: { row: IUser }) {
  return (
    <tr>
      <td colSpan={5}>
        <div className={styles.ExpandedRowContainer}>
          <div className={styles.ExpandedRowColumn}>
            {row.imageLink ? (
              <img
                src={row.imageLink}
                alt="Profile Image"
                className={styles["profile-image"]}
                style={{
                  width: "90px",
                  height: "90px",
                }}
              />
            ) : (
              <div
                className={styles["profile-image"]}
                style={{
                  width: "90px",
                  height: "90px",
                }}
              >
                <ProfilePicIcon />
              </div>
            )}
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
                  {new Date(row.startDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className={styles.DetailRow}>
              <div className={styles.Detail}>
                <span className={styles.Label}>Date of Birth</span>
                <span className={styles.Content}>
                  {new Date(row.birthDate).toLocaleDateString()}
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

export function Row({ volunteer, refreshUsers }: Props) {
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
    refreshUsers();
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
            <ApplyDropdown
              className={styles.accessLevelContainer}
              options={roleDropdownOptions}
              value={updatedRole}
              showError={false}
              onChange={(e: SelectChangeEvent<Role>) => {
                const newRole = e.target.value as Role;
                setUpdatedRole(newRole as Role);
                internalRequest<IUser>({
                  url: "/api/volunteer",
                  method: HttpMethod.PATCH,
                  body: {
                    email: volunteer.email,
                    newFields: {
                      role: newRole,
                    },
                  },
                });
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
              categoryName="Role"
            />
          </div>
        </td>
        <td className={styles.RowCell}>
          <div className={styles.actionsContainer}>
            <button
              className={styles.approveButton}
              onClick={() => handleAdminApproval(volunteer.email, true)}
            >
              <CheckCircle />
              Approve
            </button>
            <button
              className={styles.denyButton}
              onClick={() => handleAdminApproval(volunteer.email, false)}
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
