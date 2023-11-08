import React, { useMemo, useState } from "react";
import {
  Error as ErrorIcon,
  RemoveRedEyeOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import styles from "./InputField.module.css";

type InputFieldProps = {
  title: string;
  type?: string;
  required: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showError: boolean;
  error?: string;
};

const InputField = (InputFieldProps: InputFieldProps) => {
  const [passwordOrText, setPasswordOrText] = useState(InputFieldProps.type);

  const toggleHidePassword = () => {
    setPasswordOrText(passwordOrText === "text" ? "password" : "text");
  };

  const EyeIcon = useMemo(
    () =>
      passwordOrText === "text" ? VisibilityOffOutlined : RemoveRedEyeOutlined,
    [passwordOrText],
  );

  return (
    <div className={styles.container}>
      <div className={styles["label-container"]}>
        <label className={styles["input-label"]}>{InputFieldProps.title}</label>
        <label className={styles.asterisk}>*</label>
      </div>
      <div className={styles["input-container"]}>
        <input
          className={`${styles["input-field"]} ${
            InputFieldProps.showError ? styles["input-field-error"] : ""
          }`}
          type={passwordOrText}
          required={InputFieldProps.required}
          placeholder={InputFieldProps.placeholder}
          value={InputFieldProps.value}
          onChange={InputFieldProps.onChange}
        />
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
