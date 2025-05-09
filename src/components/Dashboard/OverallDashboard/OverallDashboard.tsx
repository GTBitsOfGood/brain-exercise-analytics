import {
  DashboardIcon as DB,
  // ImportantGrayIcon as IGI,
  TimeForward as TF,
  LastPage as PF,
  // CalendarIcon as COI,
  SqrtIcon as SQ,
  BookIcon as BI,
  DocIcon as DI,
  QuestionIcon as QI,
  BarChartIcon,
  InfoIcon,
} from "@src/app/icons";
import { CSSProperties, useState, useRef, useEffect } from "react";
import { DateRangeEnum, Days } from "@/common_utils/types";
import { D3Data } from "@src/utils/types";
import Chip from "@src/components/Chip/Chip";
import ActiveIndicatorBox from "@src/components/ActiveIndicatorBox/ActiveIndicatorBox";
import DateSelector from "@src/components/DateSelector/DateSelector";
import PopupModal from "@src/components/Graphs/PopupModal/PopupModal";
import { BarChart, SmallDataBox, WeeklyProgress } from "../../Graphs";
import styles from "./OverallDashboard.module.scss";

interface Params {
  active: boolean;
  name: string;
  streak: Days[];
  startDate: Date;
  lastSessionDate: Date;
  lastSession: {
    mathQuestionsCompleted: number;
    wordsRead: number;
    promptsCompleted: number;
    triviaQuestionsCompleted: number;
  };
  sessionCompletionHistory: D3Data["data"];
  style?: CSSProperties;
  menuState: [
    selectedValue: DateRangeEnum,
    setSelectedvalue: (value: DateRangeEnum) => void,
  ];

  // Need to update with the schema of the response we will get from the backend
}

const options: Intl.DateTimeFormatOptions = {
  day: "numeric",
  year: "numeric",
  month: "short",
};

function formatDate(date: Date) {
  const str = date.toLocaleDateString("en-us", options);
  const arr = str.split(" ");
  return [arr[0], arr[1], arr[2]].join(" ");
}

export default function OverallDashboard(params: Params) {
  const [infoPopup, setInfoPopup] = useState(false);
  const infoButtonRef = useRef(null);
  const [popupX, setPopupX] = useState<number | null>(null);
  const [popupY, setPopupY] = useState<number | null>(null);

  useEffect(() => {
    const onScroll = () => setInfoPopup(false);
    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (infoButtonRef.current) {
      const rect: Element = infoButtonRef.current;
      const newTop = rect.getBoundingClientRect().y + 30;
      setPopupY(newTop);
      const left = rect.getBoundingClientRect().x;
      setPopupX(left);
    }
  }, [setPopupX, setPopupY, setInfoPopup]);

  return (
    <div className={styles.OverallDashboard} style={params.style}>
      <div className={styles.titleRow}>
        <DB />
        <p
          className={styles.title}
          style={{ marginLeft: "20px", color: "#2b3674" }}
        >
          Overall Dashboard
        </p>
        <p
          className={styles.title}
          style={{ color: "#a3aed0", marginLeft: "62px" }}
        >
          {params.name}
        </p>
        <ActiveIndicatorBox
          active={params.active}
          style={{ marginLeft: "17px", marginRight: "10px" }}
        />
        <div
          className={styles.infoBox}
          onMouseEnter={() => {
            setInfoPopup(true);
          }}
          onMouseLeave={() => {
            setInfoPopup(false);
          }}
          ref={infoButtonRef}
          style={{ position: "relative" }}
        >
          <InfoIcon />
          <PopupModal
            show={infoPopup}
            info={
              "Active means a user has completed at least two sessions each week for the past two weeks."
            }
            style={{
              position: "fixed",
              top: `${popupY}px`,
              zIndex: 500,
              left: `${popupX}px`,
            }}
          />
        </div>
        <div className={styles.dateSelector}>
          <DateSelector
            selectedValue={params.menuState[0]}
            setSelectedValue={params.menuState[1]}
          />
        </div>
        {/* <Dropdown style={{ marginLeft: "auto" }} /> */}
      </div>
      <WeeklyProgress days={params.streak} />
      <div className={styles.bottomContainer}>
        <div className={styles.dateBoxes}>
          <SmallDataBox
            className={styles.box}
            title="Start Date"
            text={formatDate(params.startDate)}
            Icon={TF}
          />
          <SmallDataBox
            className={styles.box}
            title="Date of Last Session"
            text={formatDate(params.lastSessionDate)}
            Icon={PF}
          />
          <SmallDataBox
            className={styles.box}
            title="Total Completed Sessions"
            text={"5"}
            Icon={BarChartIcon}
          />
        </div>

        <BarChart
          width={300}
          height={200}
          title="Session Completion History"
          data={params.sessionCompletionHistory}
          highlightLargest
          fullWidth
          style={{ width: "30%" }}
          gridLines
        />

        <div className={styles.lastSession}>
          <p className={styles.title}>Last Session</p>
          <div className={styles.verBoxes}>
            <div className={styles.horBoxes}>
              <SmallDataBox
                className={styles.box}
                title="Questions Completed"
                text={params.lastSession.mathQuestionsCompleted.toString()}
                Icon={SQ}
                Chip={() => <Chip color="#FF9FB34D">Math</Chip>}
              />
              <SmallDataBox
                className={styles.box}
                title="Prompts Completed"
                text={params.lastSession?.promptsCompleted.toString()}
                Icon={DI}
                Chip={() => <Chip color="#32D29633">Writing</Chip>}
              />
            </div>
            <div className={styles.horBoxes}>
              <SmallDataBox
                className={styles.box}
                title="Words Read Per Min"
                text={params.lastSession.wordsRead.toString()}
                Icon={BI}
                Chip={() => <Chip color="#008AFC1A">Reading</Chip>}
              />
              <SmallDataBox
                className={styles.box}
                title="Questions Completed"
                text={params.lastSession.triviaQuestionsCompleted.toString()}
                Icon={QI}
                Chip={() => <Chip color="#FBBC054D">Trivia</Chip>}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
