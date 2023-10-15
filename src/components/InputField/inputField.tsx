import React, { useState } from "react";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { Poppins } from "next/font/google";
import styles from "./inputField.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

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

  return (
    <div className={styles.container}>
      <main className={poppins.variable}>
        <div className={styles["label-container"]}>
          <label className={styles["input-label"]}>
            {InputFieldProps.title}
          </label>
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
          ></input>
          {InputFieldProps.type !== null &&
            InputFieldProps.type === "password" && (
              <RemoveRedEyeOutlinedIcon
                className={styles["eye-icon"]}
                onClick={() => toggleHidePassword()}
              />
            )}
        </div>
        {InputFieldProps.showError && InputFieldProps.error !== undefined && (
          <div className={styles["error-container"]}>
            <FontAwesomeIcon
              className={styles["error-icon"]}
              icon={faExclamationCircle}
              size="sm"
            />
            <p className={styles["error-message"]}>{InputFieldProps.error}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default InputField;
