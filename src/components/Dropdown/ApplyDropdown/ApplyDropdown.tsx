"use client";

import React, { ReactNode, useCallback, useMemo, useState } from "react";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { CheckCircle } from "@src/app/icons";
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
import styles from "./ApplyDropdown.module.css";

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
  applyButtonStyle?: React.CSSProperties;
  style?: React.CSSProperties;
  selectProps?: SelectProps;
  categoryName?: string;
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

export default function ApplyDropdown<T>(props: DropdownProps<T>) {
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
    applyButtonStyle,
    style,
    selectProps,
    categoryName,
  } = props;

  const [selected, setSelected] = useState<T>(value);

  const onOpen = useCallback(() => {
    setSelected(value);
  }, [value, setSelected]);

  const onSelectChange = useCallback(
    (e: React.MouseEvent<HTMLLIElement, MouseEvent>, selectedValue: T) => {
      e.stopPropagation();
      setSelected(selectedValue);
    },
    [setSelected],
  );

  const onApplySelect = useCallback(
    (e: SelectChangeEvent<T>) => {
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
    <div className={classes(styles.container, className)}>
      <StyledSelect
        className={styles["input-field"]}
        value={displayValue}
        onChange={onApplySelect as (e: SelectChangeEvent<unknown>) => void}
        onOpen={onOpen}
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
              borderRadius: "12px",
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
            <MenuItem
              className={classes(styles.checkMenuItem)}
              key={index}
              value={dropdownOption.value as string}
              onClickCapture={(
                e: React.MouseEvent<HTMLLIElement, MouseEvent>,
              ) => {
                onSelectChange(e, dropdownOption.value);
              }}
            >
              <div
                className={classes(styles.defaultMenuItem, poppins.className)}
                style={menuItemStyle}
              >
                {dropdownOption.displayValue}
              </div>
              <div className={classes(styles.checkIcon)}>
                {dropdownOption.value === selected && <CheckCircle />}
              </div>
            </MenuItem>
          );
        })}
        <MenuItem
          key={"applyButton"}
          className={classes(styles.applyButtonMenuItem)}
          value={selected as string}
          style={{ backgroundColor: "transparent" }}
          disableRipple
          disableGutters
        >
          <div
            className={classes(styles.applyButton, poppins.className)}
            style={applyButtonStyle}
          >
            <p>{`Apply${categoryName ? ` ${categoryName}` : ""}`}</p>
          </div>
        </MenuItem>
      </StyledSelect>
    </div>
  );
}
