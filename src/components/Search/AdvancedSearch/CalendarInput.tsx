import React, { RefObject, createRef, useEffect, Ref } from "react";
import Calendar from "react-calendar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import styles from "./AdvancedSearch.module.css";

interface CalendarInputProp {
  showCalendar: boolean;
  calendarValue: string;
  setShowCalendar: (showCalendar: boolean) => void;
  setCalendarValue: (value: string) => void;
}

export const CalendarInput = ({
  showCalendar,
  calendarValue = "",
  setShowCalendar,
  setCalendarValue,
}: CalendarInputProp) => {
  const calendarPopupRef: RefObject<HTMLDivElement> = createRef();
  const iconRef: Ref<SVGSVGElement> = createRef();

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (showCalendar && !iconRef.current?.contains(event.target as Node)) {
        if (
          calendarPopupRef.current &&
          event.target instanceof Node &&
          calendarPopupRef.current.contains(event.target)
        ) {
          event.stopPropagation();
          return;
        }

        setShowCalendar(false);
      }
    };

    const toggleCalendar = (event: MouseEvent) => {
      setShowCalendar(!showCalendar);
      event.stopPropagation();
    };

    const iconRefCopy = iconRef.current;
    iconRef.current?.addEventListener("click", toggleCalendar);
    document.addEventListener("click", onClickOutside);

    return () => {
      iconRefCopy?.removeEventListener("click", toggleCalendar);
      document.removeEventListener("click", onClickOutside);
    };
  }, [showCalendar]);

  return (
    <div
      className={[styles.answer, styles.calendarContainer].join(" ")}
      onClick={() => {
        setShowCalendar(!showCalendar);
      }}
    >
      {calendarValue === "" && "MM/DD/YYYY"}
      {calendarValue !== "" && calendarValue}
      <div>
        <FontAwesomeIcon
          ref={iconRef}
          icon={faCalendarAlt}
          style={{ cursor: "pointer", float: "right" }}
        />
        <div
          className={styles.calendar}
          style={{
            position: "absolute",
            zIndex: 50,
            display: showCalendar ? "block" : "none",
          }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div ref={calendarPopupRef}>
            <Calendar
              onChange={(value, event) => {
                event.stopPropagation();
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
        </div>
      </div>
    </div>
  );
};
