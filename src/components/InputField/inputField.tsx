import React from "react";
import "./inputField.css";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
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
  return (
    <div>
      <label className="input-label">{InputFieldProps.title}*</label>
      <input
        className="input-field"
        type={InputFieldProps.type}
        required={InputFieldProps.required}
        placeholder={InputFieldProps.placeholder}
        value={InputFieldProps.value}
        onChange={InputFieldProps.onChange}
      ></input>
      {InputFieldProps.showError && (
        <p className="error">
          <FontAwesomeIcon
            className="error-icon"
            icon={faExclamationCircle}
            size="lg"
          />
          {InputFieldProps.error}
        </p>
      )}
    </div>
  );
};

export default InputField;
