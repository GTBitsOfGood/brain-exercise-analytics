import React from "react";

import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  options: DropdownOption<T>[];
  value?: T;
  title?: string;
  required: boolean;
  showError: boolean;
  error?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  style?: object;
}

function Dropdown<T>(props: DropdownProps<T>) {
  const { options, title, required, placeholder, showError, error } = props;
  let { style } = props;
  if (!style) {
    style = {};
  }
  return (
    <div className={styles.container} style={style}>
      <main className={poppins.variable}>
        {title !== undefined ? (
          <div className={styles["label-container"]}>
            <label className={styles["input-label"]}>{title}</label>
            {required && <label className={styles.asterisk}>*</label>}
          </div>
        ) : null}
        <div className={styles["input-container"]}>
          <select
            className={
              showError ? styles["input-field-error"] : styles["input-field"]
            }
            value={props.value as unknown as string}
            onChange={props.onChange}
          >
            {placeholder && (
              <option value="" disabled selected>
                {placeholder}
              </option>
            )}

            {options.map((option, index) => (
              <option key={index} value={option.value as unknown as string}>
                {option.displayValue}
              </option>
            ))}
          </select>
        </div>
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
      </main>
    </div>
  );
}

export default Dropdown;