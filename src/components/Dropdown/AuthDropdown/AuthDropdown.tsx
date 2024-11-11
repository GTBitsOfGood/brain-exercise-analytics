import { useState } from "react";
import { SelectChangeEvent } from "@mui/material";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { classes } from "@src/utils/utils";
import styles from "./AuthDropdown.module.css";
import Dropdown from "../Dropdown";

export interface DropdownOption<T> {
  value: T;
  displayValue: string;
}
export interface DropdownProps<T> {
  className?: string;
  options: DropdownOption<T>[];
  value: T;
  title?: string;
  required: boolean;
  showError: boolean;
  error?: string;
  placeholder?: string;
  onChange: (e: SelectChangeEvent<T>) => void;
  resetChangeTriggers?: string | boolean;
}

export default function AuthDropdown<T>(props: DropdownProps<T>) {
  const {
    className,
    options,
    value,
    title,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    required,
    placeholder,
    showError,
    error,
    onChange,
    resetChangeTriggers,
  } = props;

  const [isOpen, setIsOpen] = useState(false);
  const dynamicBorderRadius = isOpen ? "12px 12px 0 0" : "12px";

  return (
    <div className={classes(styles.container, className)}>
      {title !== undefined ? (
        <div className={styles["label-container"]}>
          <label className={styles["input-label"]}>{title}</label>
        </div>
      ) : null}
      <Dropdown
        className={styles["dropdown-container"]}
        options={options}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        showError={showError}
        sx={{ fontSize: "11px" }}
        selectProps={{
          open: isOpen,
          onOpen: () => setIsOpen(true),
          onClose: () => setIsOpen(false),
        }}
        style={{ borderRadius: dynamicBorderRadius }}
        menuProps={{
          PaperProps: {
            sx: {
              maxHeight: 200,
              borderRadius: "0 0 12px 12px",
              boxShadow: "0px 50px 100px 100px #7090B026",
            },
          },
        }}
        defaultBackgroundColor="#e3eafc"
        hoverColor="#ffffff"
        resetChangeTrigger={resetChangeTriggers}
      />
      {showError && error !== undefined && (
        <div className={styles["error-container"]}>
          <FontAwesomeIcon
            className={styles["error-icon"]}
            icon={faExclamationCircle}
            size="sm"
          />
          <p className={styles["error-message"]}>{error}</p>
        </div>
      )}
    </div>
  );
}
