"use client";

import {
  Select,
  SelectChangeEvent,
  MenuItem,
  MenuProps,
  SelectProps,
  SxProps,
  Theme,
  styled,
} from "@mui/material";
import { Poppins } from "next/font/google";
import { useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import React, { ReactNode, useMemo } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { classes } from "@src/utils/utils";

// const options: DropdownOption<string>[] = Object.values(
//   DateRangeEnum,
// ).map((range) => ({
//   value: range,
//   displayValue: range.toString(),
// }));

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select";
import styles from "./GroupSelector.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
interface DropdownOption<T> {
  value: T;
  displayValue: string;
}
interface DropdownProps<T> {
  className?: string;
  options: (DropdownOption<T> | ReactNode)[];
  value: T;
  showError: boolean;
  placeholder?: string;
  onChange: (e: SelectChangeEvent<T>) => void;
  sx?: SxProps<Theme>;
  menuProps?: Partial<MenuProps>;
  menuItemStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  selectProps?: SelectProps;
}

const StyledSelect = styled(Select)(() => ({
  padding: 0,
  fontSize: 12,
  fontFamily: poppins400.style.fontFamily,
  "&.MuiOutlinedInput-root": {
    "& fieldset": {
      border: "0px solid",
      // borderRadius: "10px",
    },
  },
}));

function GroupSelector({ shownValue }: { shownValue: string }) {
  const ss = useSelector(
    (patientSearchState: RootState) => patientSearchState.patientSearch,
  );
  const {
    active,
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
  console.log(ss);

  const menuItemStyle = {
    justifyContent: "center",
    color: "#2B3674",
    backgroundColor: "#FCE8DC",
    borderRadius: "10px",
    marginBottom: "10px",
    marginLeft: "16px",
    marginRight: "auto",
    width: "fit-content",
    fontSize: "16px",
    fontFamily: poppins400.style.fontFamily,
    padding: "7px",
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
    ...Array.from(countries).map((v) => `Country: ${v}`),
    ...Array.from(states).map((v) => `States: ${v}`),
  ];
  console.log(countries);
  console.log(options);

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
              style={{ opacity: 1 }}
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
