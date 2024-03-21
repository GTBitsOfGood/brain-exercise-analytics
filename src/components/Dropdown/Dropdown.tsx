"use client";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import React, { useCallback, useMemo, useState } from "react";

import { classes } from "@src/utils/utils";
import {
  MenuItem,
  MenuProps,
  Select,
  SelectChangeEvent,
  SxProps,
  Theme,
  styled,
} from "@mui/material";
import { Poppins } from "next/font/google";
import styles from "./Dropdown.module.css";

export interface DropdownOption<T> {
  value: T;
  displayValue: string;
}

export interface DropdownProps<T> {
  className?: string;
  options: DropdownOption<T>[];
  value: T;
  showError: boolean;
  placeholder?: string;
  onChange: (e: SelectChangeEvent<T>) => void;
  sx?: SxProps<Theme>;
  menuProps?: Partial<MenuProps>;
  menuItemStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

const poppins400 = Poppins({
  subsets: ["latin-ext"],
  weight: "400",
});

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

const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: 12,
  fontFamily: poppins400.style.fontFamily,
  color: "#313144",
  "&:hover": {
    backgroundColor: "#E3EAFC",
  },
}));

function Dropdown<T>(props: DropdownProps<T>) {
  const {
    className,
    options,
    value,
    placeholder,
    showError,
    onChange,
    sx,
    menuProps,
    menuItemStyle,
    style,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const dynamicBorderRadius = isOpen ? "12px 12px 0 0" : "12px";

  const onSelectChange = useCallback(
    (e: SelectChangeEvent<T>) => {
      onChange(e);
    },
    [onChange],
  );

  const displayValue = useMemo(
    () => options.find((o) => o.value === value)?.displayValue ?? " ",
    [options, value],
  );

  const extraStyle = useMemo(
    () =>
      showError
        ? {
            borderColor: "#f30000",
            backgroundColor: "#f300001a",
          }
        : {
            borderColor: "#e0e5f2",
            backgroundColor: "#ffffff",
          },
    [showError],
  );

  return (
    <div className={classes(styles.container, className)}>
      <StyledSelect
        className={styles["input-field"]}
        value={displayValue}
        onChange={onSelectChange as (e: SelectChangeEvent<unknown>) => void}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        style={{
          textAlign: "left",
          borderRadius: dynamicBorderRadius,
          borderWidth: "1px",
          borderStyle: "solid",
          paddingRight: "0px",
          color: displayValue === " " ? "#a3aed0" : "#313144",
          ...extraStyle,
          ...style,
        }}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              maxHeight: 200,
              borderRadius: "0 0 12px 12px",
              boxShadow: "0px 50px 100px 100px #7090B026",
            },
          },
          ...menuProps,
        }}
        sx={sx}
        IconComponent={KeyboardArrowDownIcon}
      >
        <StyledMenuItem value=" " disabled>
          {placeholder}
        </StyledMenuItem>
        {options.map((option, index) => (
          <StyledMenuItem
            key={index}
            value={option.value as string}
            style={menuItemStyle}
          >
            {option.displayValue}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </div>
  );
}

export default Dropdown;
