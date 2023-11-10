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

export interface IDropdownProps {
  name?: string;
  selectedValue: string;
  setSelectedValue: (finalValue: string) => void;
  options: IDropdownOption[];
  required?: boolean;
  type?: string;
  placeholder?: string;
  labelName?: string;
  height?: string;
  error?: string;
  showError?: boolean;
  icon?: React.ReactElement;
  style?: object;
  roundBorder?: boolean;
  hoverBackgroundColor?: string;
  hoverFontColor?: string;
  inputBoxHeight?: string;
  onChange: (e: React.MouseEvent<HTMLLIElement>) => void;
}

function Dropdown({
  labelName,
  options = defaultOption,
  placeholder,
  required,
  height = "300px",
  error,
  showError,
  onChange,
  icon,
  style,
  selectedValue,
  roundBorder,
  hoverBackgroundColor = "#DADADA",
  hoverFontColor = "black",
  setSelectedValue,
  inputBoxHeight,
}: IDropdownProps) {
  const [showList, setShowList] = useState(false);
  const wrapperRef = createRef<HTMLDivElement>();

  document.documentElement.style.setProperty(
    "--hover-bg-color",
    hoverBackgroundColor,
  );
  document.documentElement.style.setProperty(
    "--hover-font-color",
    hoverFontColor,
  );

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
  }, [options, selectedValue, setSelectedValue]);

  return (
    <div className={styles.container} ref={wrapperRef} style={{ ...style }}>
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
            roundBorder ? styles.shown_drop_down_round : null,
            showError ? styles.error_input_box : null,
          ].join(" ")}
          style={{ height: inputBoxHeight }}
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
          className={[
            styles.option_list_div,
            roundBorder ? styles.option_list_div_round : null,
          ].join(" ")}
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
}

export default Dropdown;
