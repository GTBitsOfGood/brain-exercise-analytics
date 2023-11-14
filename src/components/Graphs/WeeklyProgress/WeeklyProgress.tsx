import { CSSProperties } from "react";
import { Days } from "@/common_utils/types";
import { GrayCircle as GC, CheckMark as CM } from "@src/app/icons";
import styles from "./WeeklyProgress.module.scss";

interface DataParams {
  days: Days[];
  style?: CSSProperties;
}
const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Current paramters do not provide this. We need to change the parameter signature
const week = ["17/9", "18/9", "19/9", "20/9", "21/9", "22/9", "23/9"];

export default function WeeklyProgress({ days, style = {} }: DataParams) {
  return (
    <div className={styles.container} style={style}>
      <p className={styles.title}>Weekly Progress</p>
      <div className={styles.streakContainer}>
        <div className={styles.line} />
        <div className={styles.days}>
          {[...Array<number>(7)].map((_, i) => (
            <div key={i} className={styles.day}>
              <div className={styles.circle}>
                <div className={styles.greyCircle}>
                  <GC />
                </div>
                {((i === 0 && days.includes(Days.Sunday)) ||
                  (i === 1 && days.includes(Days.Monday)) ||
                  (i === 2 && days.includes(Days.Tuesday)) ||
                  (i === 3 && days.includes(Days.Wednesday)) ||
                  (i === 4 && days.includes(Days.Thursday)) ||
                  (i === 5 && days.includes(Days.Friday)) ||
                  (i === 6 && days.includes(Days.Saturday))) && (
                  <div className={styles.blueCircle}>
                    <CM />
                  </div>
                )}
              </div>
              <div className={styles.dayTextContainer}>
                <p
                  className={styles.text}
                  style={{
                    color: "#A3AED0",
                  }}
                >
                  {weekDays[i]}
                </p>
                <p className={styles.text}>{week[i]}</p>
              </div>
              {((i === 0 &&
                days.includes(Days.Sunday) &&
                days.includes(Days.Monday)) ||
                (i === 1 &&
                  days.includes(Days.Monday) &&
                  days.includes(Days.Tuesday)) ||
                (i === 2 &&
                  days.includes(Days.Tuesday) &&
                  days.includes(Days.Wednesday)) ||
                (i === 3 &&
                  days.includes(Days.Wednesday) &&
                  days.includes(Days.Thursday)) ||
                (i === 4 &&
                  days.includes(Days.Thursday) &&
                  days.includes(Days.Friday)) ||
                (i === 5 &&
                  days.includes(Days.Friday) &&
                  days.includes(Days.Saturday))) && (
                <div className={styles.blueLine} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
