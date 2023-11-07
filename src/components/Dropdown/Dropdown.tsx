import React, { createRef, useEffect, useState } from "react";
import {
  faCaretDown,
  faCaretUp,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./Dropdown.module.css";

export interface IDropdownOption {
  value: string | number;
  displayValue: string | number;
}

const defaultOption = [{ value: "", displayValue: "No option available" }];

interface IDropdownProps {
  name?: string;
  options: IDropdownOption[];
  required?: boolean;
  tabIndex?: number;
  type?: string;
  placeholder?: string;
  labelName?: string;
  height?: string;
  error?: string;
  showError?: boolean;
  icon?: React.ReactElement;
  onChange: (e: React.MouseEvent<HTMLLIElement>) => void;
}

export const Dropdown = ({
  labelName,
  options = defaultOption,
  placeholder,
  required,
  height = "300px",
  error,
  showError,
  onChange,
  icon,
}: IDropdownProps) => {
  const [showList, setShowList] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const wrapperRef = createRef<HTMLDivElement>();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | Event) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowList(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  useEffect(() => {
    const isValuePresent = options.some(
      (o) => o.displayValue === selectedValue,
    );
    if (!isValuePresent) {
      setSelectedValue("");
    }
  }, [options, selectedValue]);

  return (
    <div className={styles.container} ref={wrapperRef}>
      <div
        className={styles.question}
        style={{ display: labelName ? "block" : "none" }}
      >
        {labelName} {required ? <span>*</span> : <></>}
      </div>
      <div className={styles.input_container}>
        <div
          className={[
            styles.shownInput,
            showList ? styles.show_drop_down : null,
            showError ? styles.error_input_box : null,
          ].join(" ")}
          onClick={() => setShowList(!showList)}
        >
          <div
            className={styles.value}
            style={{ color: selectedValue === "" ? "gray" : "black" }}
          >
            {icon && <>{icon}</>}&nbsp;
            {selectedValue === "" ? placeholder : selectedValue}
          </div>
          <FontAwesomeIcon icon={showList ? faCaretUp : faCaretDown} />
        </div>
        <div
          className={styles.option_list_div}
          style={{ display: showList ? "block" : "none", maxHeight: height }}
        >
          <ul>
            <li className={styles.non_select_option}>{placeholder}</li>
            {options.map((value, index) => {
              return (
                <li
                  key={index}
                  onClick={(e: React.MouseEvent<HTMLLIElement>) => {
                    setSelectedValue(e.currentTarget.innerText);
                    onChange(e);
                    setShowList(false);
                  }}
                  className={styles.option_item}
                >
                  {value.displayValue}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {showError && (
        <span className={styles.errorBlock}>
          {" "}
          <FontAwesomeIcon icon={faExclamationCircle} /> {error}{" "}
        </span>
      )}
    </div>
  );
};
