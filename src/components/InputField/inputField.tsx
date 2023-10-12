import React, { useState } from "react";
import "./inputField.css";
import { faExclamationCircle, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
    <div className="container">
      <label className="input-label">{InputFieldProps.title}*</label>
      <div className="input-container">
        <input
          className="input-field"
          type={passwordOrText}
          required={InputFieldProps.required}
          placeholder={InputFieldProps.placeholder}
          value={InputFieldProps.value}
          onChange={InputFieldProps.onChange}
        ></input>
        {InputFieldProps.type !== null &&
          InputFieldProps.type === "password" && (
            <FontAwesomeIcon
              className="eye-icon"
              icon={faEye}
              size="lg"
              onClick={() => toggleHidePassword()}
            />
          )}
      </div>
      {InputFieldProps.showError && (
        <div className="error-container">
          <FontAwesomeIcon
            className="error-icon"
            icon={faExclamationCircle}
            size="sm"
          />
          <p className="error-message">{InputFieldProps.error}</p>
        </div>
      )}
    </div>
  );
};

export default InputField;
