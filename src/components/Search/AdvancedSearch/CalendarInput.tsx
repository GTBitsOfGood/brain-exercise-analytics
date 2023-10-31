import React, { RefObject } from "react";
import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./AdvancedSearch.module.css";

interface CalendarInputProp {
  iconRef: RefObject<HTMLDivElement>;
  showCalendar: boolean;
  calendarValue: string;
  setShowCalendar: (showCalendar: boolean) => void;
  setCalendarValue: (value: string) => void;
  calendarX: number;
  calendarY: number;
}

export const CalendarInput = ({
  iconRef,
  showCalendar,
  calendarValue = "",
  setShowCalendar,
  setCalendarValue,
  calendarX,
  calendarY,
}: CalendarInputProp) => {
  return (
    <div
      className={styles.answer}
      style={{
        display: "flex",
        backgroundColor: "white",
        verticalAlign: "middle",
        justifyContent: "space-between",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 0,
        paddingBottom: 0,
      }}
      onClick={() => setShowCalendar(!showCalendar)}
      ref={iconRef} //eslint-disable-line
    >
      {calendarValue === "" && "MM/DD/YYYY"}
      {calendarValue !== "" && calendarValue}
      <FontAwesomeIcon
        icon={faCalendarAlt}
        style={{ cursor: "pointer", float: "right" }}
      />
      {showCalendar && (
        <div
          style={{
            position: "fixed",
            top: `${calendarY}px`,
            left: `${calendarX}px`,
            zIndex: 50,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Calendar
            onChange={(value) => {
              if (!value) {
                return;
              }
              const date = new Date(value.toString());
              setCalendarValue(
                `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`,
              );
              setShowCalendar(false);
            }}
          />
        </div>
      )}
    </div>
  );
};
