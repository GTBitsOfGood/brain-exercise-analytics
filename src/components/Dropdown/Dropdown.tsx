"use client";

import React, {
  ReactNode,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { classes } from "@src/utils/utils";
import {
  MenuItem,
  MenuProps,
  Select,
  SelectChangeEvent,
  SelectProps,
  SxProps,
  Theme,
  styled,
} from "@mui/material";
import { Poppins } from "next/font/google";
import styles from "./Dropdown.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export interface DropdownOption<T> {
  value: T;
  displayValue: string;
}

export interface DropdownProps<T> {
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
  defaultBackgroundColor?: string;
  hoverColor?: string;
  resetChangeTrigger?: string | boolean;
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

function Dropdown<T>(props: DropdownProps<T>) {
  const [changeTriggered, setChangeTriggered] = useState(false);

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
    selectProps,
    defaultBackgroundColor,
    hoverColor,
    resetChangeTrigger,
  } = props;

  useEffect(() => {
    setChangeTriggered(false);
  }, [resetChangeTrigger, setChangeTriggered]);

  const onSelectChange = useCallback(
    (e: SelectChangeEvent<T>) => {
      setChangeTriggered(true);
      onChange(e);
    },
    [onChange],
  );

  const displayValue = useMemo(() => {
    const option = options.find(
      (o) =>
        !React.isValidElement(o) && (o as DropdownOption<T>).value === value,
    ) as DropdownOption<T> | undefined;
    if (option) {
      return option.displayValue;
    }
    return placeholder;
  }, [options, value, placeholder]);

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
    <div
      className={classes(styles.container, className)}
      style={
        {
          "--dropdown-background-color": changeTriggered
            ? ""
            : defaultBackgroundColor,
          "--dropdown-hover-color": hoverColor,
        } as React.CSSProperties
      }
    >
      <StyledSelect
        className={styles["input-field"]}
        value={displayValue}
        onChange={onSelectChange as (e: SelectChangeEvent<unknown>) => void}
        style={{
          textAlign: "left",
          borderWidth: "1px",
          borderStyle: "solid",
          paddingRight: "0px",
          color: displayValue === placeholder ? "#a3aed0" : "#313144",
          ...extraStyle,
          ...style,
        }}
        MenuProps={{
          disableScrollLock: true,
          PaperProps: {
            sx: {
              maxHeight: 200,
            },
          },
          ...menuProps,
        }}
        sx={sx}
        renderValue={() => displayValue}
        IconComponent={KeyboardArrowDownIcon}
        {...selectProps}
      >
        {placeholder && (
          <MenuItem value=" " disabled>
            <div className={styles.defaultMenuItem}>{placeholder}</div>
          </MenuItem>
        )}
        {options.map((option, index) => {
          if (React.isValidElement(option)) {
            return option;
          }

          const dropdownOption = option as DropdownOption<T>;
          return (
            <MenuItem key={index} value={dropdownOption.value as string}>
              <div
                className={classes(styles.defaultMenuItem, poppins.className)}
                style={menuItemStyle}
              >
                {dropdownOption.displayValue}
              </div>
            </MenuItem>
          );
        })}
      </StyledSelect>
    </div>
  );
}

export default Dropdown;
