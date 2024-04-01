"use client";

import { Select, MenuItem, styled } from "@mui/material";
import { Poppins } from "next/font/google";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import React from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { classes } from "@src/utils/utils";

import styles from "./GroupSelector.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });

const StyledSelect = styled(Select)(() => ({
  padding: 0,
  fontSize: 12,
  fontFamily: poppins400.style.fontFamily,
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      border: "0px solid",
    },
  },
}));

function GroupSelector({ shownValue }: { shownValue: string }) {
  const ss = useSelector(
    (patientSearchState: RootState) => patientSearchState.patientSearch,
  );
  const {
    countries,
    states,
    cities,
    dateOfBirths,
    emails,
    additionalAffiliations,
    dateOfJoins,
    beiChapters,
    secondaryPhoneNumbers,
    secondaryNames,
  } = ss;

  const menuItemStyle: React.CSSProperties = {
    justifyContent: "center",
    color: "#2B3674",
    backgroundColor: "#FCE8DC",
    borderRadius: "10px",
    marginBottom: "5px",
    marginLeft: "0px",
    width: "fit-content",
    maxWidth: "auto",
    fontSize: "16px",
    fontFamily: poppins400.style.fontFamily,
    padding: "7px",
    overflowWrap: "break-word",
    whiteSpace: "pre-wrap",
  };
  const sx = {
    "&.MuiOutlinedInput-root": {
      "& fieldset": {
        borderRadius: "0px",
      },
    },
  };

  let options = [];
  options = [
    ...countries.map((v) => `Country: ${v}`),
    ...states.map((v) => `State: ${v}`),
    ...cities.map((v) => `City: ${v}`),
    ...dateOfBirths.map((v) => `Birthdate: ${v}`),
    ...emails.map((v) => `Email: ${v}`),
    ...additionalAffiliations.map((v) => `Additional Affiliation: ${v}`),
    ...dateOfJoins.map((v) => `Date Joined: ${v}`),
    ...beiChapters.map((v) => `BEI Chapter: ${v}`),
    ...secondaryPhoneNumbers.map((v) => `Secondary Phone: ${v}`),
    ...secondaryNames.map((v) => `Secondary Name: ${v}`),
  ];

  return (
    <div className={classes(styles.container)}>
      <StyledSelect
        className={styles["input-field"]}
        value={shownValue}
        style={{
          borderWidth: "1px",
          borderStyle: "solid",
          paddingRight: "0px",
          borderColor: "#e0e5f2",
          backgroundColor: "#ffffff",
          borderRadius: 0,
          color: "#2B3674",
          border: "none",
          fontSize: "18px",
          fontFamily: poppins500.style.fontFamily,
          width: "200px",
          textAlign: "center",
        }}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              maxHeight: 200,
            },
          },
        }}
        sx={sx}
        renderValue={() => shownValue}
        IconComponent={KeyboardArrowDownIcon}
      >
        {options.map((option, index) => {
          if (React.isValidElement(option)) {
            return option;
          }

          const dropdownOption = option;
          return (
            <MenuItem
              key={index}
              value={dropdownOption}
              disabled
              style={{ opacity: 1, width: "250px" }}
            >
              <div
                className={classes(styles.defaultMenuItem, poppins.className)}
                style={menuItemStyle}
              >
                {dropdownOption}
              </div>
            </MenuItem>
          );
        })}
      </StyledSelect>
    </div>
  );
}

export default GroupSelector;
