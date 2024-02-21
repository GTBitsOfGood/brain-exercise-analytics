import React, { useMemo, useState } from "react";
import {
  Error as ErrorIcon,
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import { classes } from "@src/utils/utils";
import styles from "./InputField.module.css";

type InputFieldProps = {
  className?: string;
  inputFieldClassName?: string;
  title?: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showError?: boolean;
  error?: string;
  icon?: JSX.Element;
};

const InputField = (InputFieldProps: InputFieldProps) => {
  const [passwordOrText, setPasswordOrText] = useState(InputFieldProps.type);

  const toggleHidePassword = () => {
    setPasswordOrText(passwordOrText === "text" ? "password" : "text");
  };

  const EyeIcon = useMemo(
    () =>
      passwordOrText === "text" ? VisibilityOffOutlined : RemoveRedEyeOutlined,
    [passwordOrText]
  );

  return (
    <div className={classes(styles.container, InputFieldProps.className)}>
      {InputFieldProps.title !== undefined ? (
        <div className={styles["label-container"]}>
          <label className={styles["input-label"]}>
            {InputFieldProps.title}
          </label>
          {InputFieldProps.required && (
            <label className={styles.asterisk}>*</label>
          )}
        </div>
      ) : null}
      <div className={styles["input-container"]}>
        {InputFieldProps.icon !== null ? (
          <div className={styles["icon-container"]}>
            <div className={styles.icon}>{InputFieldProps.icon}</div>
            <input
              className={classes(
                styles["input-field"],
                InputFieldProps.showError
                  ? styles["input-field-error"]
                  : undefined,
                InputFieldProps.inputFieldClassName,
                InputFieldProps.type === "password"
                  ? styles["password-field"]
                  : undefined
              )}
              type={passwordOrText}
              required={InputFieldProps.required ?? false}
              placeholder={InputFieldProps.placeholder}
              value={InputFieldProps.value}
              onChange={InputFieldProps.onChange}
            />
          </div>
        ) : (
          <div>
            <input
              className={classes(
                styles["input-field"],
                InputFieldProps.showError
                  ? styles["input-field-error"]
                  : undefined,
                InputFieldProps.inputFieldClassName,
                InputFieldProps.type === "password"
                  ? styles["password-field"]
                  : undefined
              )}
              type={passwordOrText}
              required={InputFieldProps.required ?? false}
              placeholder={InputFieldProps.placeholder}
              value={InputFieldProps.value}
              onChange={InputFieldProps.onChange}
            />
          </div>
        )}

        {InputFieldProps.type !== null &&
          InputFieldProps.type === "password" && (
            <EyeIcon
              className={styles["eye-icon"]}
              onClick={toggleHidePassword}
              fontSize="small"
            />
          )}
      </div>
      {InputFieldProps.showError && InputFieldProps.error !== undefined && (
        <div className={styles["error-container"]}>
          <ErrorIcon className={styles["error-icon"]} sx={{ width: "18px" }} />
          <p className={styles["error-message"]}>{InputFieldProps.error}</p>
        </div>
      )}
    </div>
  );
};

export default InputField;
