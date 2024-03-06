import { useMemo, useState } from "react";
import { HttpMethod, IUser, Role } from "@/common_utils/types";
import { SelectChangeEvent } from "@mui/material";
import Dropdown, { DropdownOption } from "@src/components/Dropdown/Dropdown";
import { internalRequest } from "@src/utils/requests";

import { getLowerAdminRoles, transformDate } from "@src/utils/utils";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";

import styles from "./Row.module.css";

interface Props {
  volunteer: IUser;
}

export default function Row({ volunteer }: Props) {
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
        displayValue: role,
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
    <tr className={styles.row} key={volunteer._id}>
      <td className={styles.RowCell}>
        <div className={styles.RowCellContainer}>{volunteer.name}</div>
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
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 18.5C13.9706 18.5 18 14.4706 18 9.5C18 4.52944 13.9706 0.5 9 0.5C4.02944 0.5 0 4.52944 0 9.5C0 14.4706 4.02944 18.5 9 18.5ZM13.7071 7.20711C14.0976 6.81658 14.0976 6.18342 13.7071 5.79289C13.3166 5.40237 12.6834 5.40237 12.2929 5.79289L7 11.0858L5.70711 9.79289C5.31658 9.40237 4.68342 9.40237 4.29289 9.79289C3.90237 10.1834 3.90237 10.8166 4.29289 11.2071L6.29289 13.2071C6.68342 13.5976 7.31658 13.5976 7.70711 13.2071L13.7071 7.20711Z"
                fill="#05CD99"
              />
            </svg>
            Approve
          </button>
          <button
            className={styles.denyButton}
            onClick={() =>
              handleAdminApproval("volunteerEmail@email.com", false)
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="19"
              viewBox="0 0 18 19"
              fill="none"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M9 18.5C13.9706 18.5 18 14.4706 18 9.5C18 4.52944 13.9706 0.5 9 0.5C4.02944 0.5 0 4.52944 0 9.5C0 14.4706 4.02944 18.5 9 18.5ZM6.70711 5.79289C6.31658 5.40237 5.68342 5.40237 5.29289 5.79289C4.90237 6.18342 4.90237 6.81658 5.29289 7.20711L7.58579 9.5L5.29289 11.7929C4.90237 12.1834 4.90237 12.8166 5.29289 13.2071C5.68342 13.5976 6.31658 13.5976 6.70711 13.2071L9 10.9142L11.2929 13.2071C11.6834 13.5976 12.3166 13.5976 12.7071 13.2071C13.0976 12.8166 13.0976 12.1834 12.7071 11.7929L10.4142 9.5L12.7071 7.20711C13.0976 6.81658 13.0976 6.18342 12.7071 5.79289C12.3166 5.40237 11.6834 5.40237 11.2929 5.79289L9 8.08579L6.70711 5.79289Z"
                fill="#EA4335"
              />
            </svg>
            Deny
          </button>
        </div>
      </td>
    </tr>
  );
}
