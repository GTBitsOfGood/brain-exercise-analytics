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
}

export default function AuthDropdown<T>(props: DropdownProps<T>) {
  const {
    className,
    options,
    value,
    title,
    required,
    placeholder,
    showError,
    error,
    onChange,
  } = props;

  return (
    <div className={classes(styles.container, className)}>
      {title !== undefined ? (
        <div className={styles["label-container"]}>
          <label className={styles["input-label"]}>{title}</label>
          {required && <label className={styles.asterisk}>*</label>}
        </div>
      ) : null}
      <Dropdown
        className={styles["dropdown-container"]}
        options={options}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        showError={showError}
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
