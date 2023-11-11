import React, { useCallback, useMemo } from "react";

import { classes } from "@src/utils/utils";
import {
  MenuItem,
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
      borderRadius: "16px",
    },
  },
}));

const StyledMenuItem = styled(MenuItem)(() => ({
  fontSize: 12,
  fontFamily: poppins400.style.fontFamily,
  color: "#313144",
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
    style,
  } = props;

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
        style={{
          textAlign: "left",
          borderRadius: "16px",
          borderWidth: "1px",
          borderStyle: "solid",
          color: displayValue === " " ? "#a3aed0" : "#313144",
          ...extraStyle,
          ...style,
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 200,

              // "& .MuiMenuItem-root.Mui-selected": {
              // backgroundColor: "#0069ca1a",
              // color: "#78adff",
              // },
              // "& .MuiMenuItem-root.Mui-selected:hover": {
              // backgroundColor: "#0069ca23",
              // },
            },
          },
        }}
        sx={sx}
      >
        <StyledMenuItem value=" " disabled>
          {placeholder}
        </StyledMenuItem>
        {options.map((option, index) => (
          <StyledMenuItem key={index} value={option.value as string}>
            {option.displayValue}
          </StyledMenuItem>
        ))}
      </StyledSelect>
    </div>
  );
}

export default Dropdown;
