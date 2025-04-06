import React, { useMemo, useState, useEffect } from "react";
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
  errorOutline?: boolean;
  error?: string;
  defaultBackgroundColor?: string;
  hoverColor?: string;
  readOnly?: boolean;
  resetChangeTrigger?: string | boolean;
};

const InputField = (InputFieldProps: InputFieldProps) => {
  const [passwordOrText, setPasswordOrText] = useState(InputFieldProps.type);

  const [changeTriggered, setChangeTriggered] = useState(false);

  useEffect(() => {
    setChangeTriggered(false);
  }, [InputFieldProps.resetChangeTrigger, setChangeTriggered]);

  const toggleHidePassword = () => {
    setPasswordOrText(passwordOrText === "text" ? "password" : "text");
  };

  const EyeIcon = useMemo(
    () =>
      passwordOrText === "text" ? VisibilityOffOutlined : RemoveRedEyeOutlined,
    [passwordOrText],
  );

  return (
    <div
      className={classes(styles.container, InputFieldProps.className)}
      style={
        {
          "--input-background-color": changeTriggered
            ? ""
            : InputFieldProps.defaultBackgroundColor,
          "--input-hover-color": InputFieldProps.hoverColor,
          "--input-pointer-events": InputFieldProps.readOnly ? "none" : "",
        } as React.CSSProperties
      }
    >
      {InputFieldProps.title !== undefined ? (
        <div className={styles["label-container"]}>
          <label className={styles["input-label"]}>
            {InputFieldProps.title}
          </label>
        </div>
      ) : null}
      <div className={styles["input-container"]}>
        <input
          className={classes(
            styles["input-field"],
            InputFieldProps.showError || InputFieldProps.errorOutline
              ? styles["input-field-error"]
              : undefined,
            InputFieldProps.inputFieldClassName,
            InputFieldProps.type === "password"
              ? styles["password-field"]
              : undefined,
          )}
          type={passwordOrText}
          required={InputFieldProps.required ?? false}
          placeholder={InputFieldProps.placeholder}
          value={InputFieldProps.value}
          onChange={(e) => {
            setChangeTriggered(true);
            InputFieldProps.onChange(e);
          }}
          readOnly={InputFieldProps.readOnly}
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
