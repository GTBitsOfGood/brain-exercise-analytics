"use client";

import { useMemo, useState } from "react";
import { HttpMethod, IUser, Role } from "@/common_utils/types";
import { SelectChangeEvent } from "@mui/material";
import Dropdown, { DropdownOption } from "@src/components/Dropdown/Dropdown";
import { internalRequest } from "@src/utils/requests";
import { classes, getLowerAdminRoles, transformDate } from "@src/utils/utils";
import { RootState } from "@src/redux/rootReducer";
import { useSelector } from "react-redux";

import styles from "./Row.module.css";

interface Props {
  volunteer: IUser;
  handleDeleteClick: (id: string) => void;
}

export function Row({ volunteer, handleDeleteClick }: Props) {
  // Role of user corresponding to the given row
  const [updatedRole, setUpdatedRole] = useState(volunteer.role);
  const [updatedActive, setUpdatedActive] = useState(
    volunteer.adminDetails.active,
  );

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

  const volunteerStatusOptions: DropdownOption<boolean>[] = [
    { value: true, displayValue: "Active" },
    { value: false, displayValue: "Inactive" },
  ];

  return (
    <tr className={styles.row} key={volunteer._id}>
      <td className={styles.RowCell}>
        <div
          className={classes(styles.RowCellContainer, styles.nameCellContainer)}
        >
          {`${volunteer.firstName} ${volunteer.lastName}`}
        </div>
      </td>
      <td className={styles.RowCell}>
        <div
          className={classes(styles.RowCellContainer, styles.dateCellContainer)}
        >
          {transformDate(volunteer.startDate)}
        </div>
      </td>
      <td className={styles.RowCell}>
        <div className={styles.RowCellContainer}>
          <Dropdown
            options={roleDropdownOptions}
            value={updatedRole}
            showError={false}
            onChange={async (e: SelectChangeEvent<Role>) => {
              const newRole = e.target.value as Role;
              setUpdatedRole(newRole);
              await internalRequest({
                url: "/api/volunteer",
                method: HttpMethod.PATCH,
                body: {
                  email: "volunteerEmail@email.com",
                  newFields: {
                    accessLevel: newRole,
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
              maxWidth: "90%",
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
      <td className={classes(styles.RowCell, styles.statusContainer)}>
        <span className={styles.RowCellContainer}>
          <Dropdown
            options={volunteerStatusOptions}
            value={updatedActive}
            showError={false}
            onChange={async (e: SelectChangeEvent<boolean>) => {
              const newActive = e.target.value as boolean;
              setUpdatedActive(newActive);
              await internalRequest({
                url: "/api/volunteer",
                method: HttpMethod.PATCH,
                body: {
                  email: "volunteerEmail@email.com",
                  newFields: {
                    status: newActive,
                  },
                },
              });
            }}
            style={{
              borderRadius: 41,
              color: "#2B3674",
              backgroundColor: "#D6F6EA",
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
        </span>
      </td>
      <td>
        <text
          className={classes(
            styles.RowCell,
            styles.RowCellContainer,
            styles.deleteButton,
          )}
          onClick={() => handleDeleteClick(volunteer._id)}
        >
          Delete Account
        </text>
      </td>
    </tr>
  );
}
