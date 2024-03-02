import React, { useMemo } from "react";
import { Poppins } from "next/font/google";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareRootVariable, faBookOpen, faFileLines, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import styles from "./Metric.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type MetricProps = {
  title: string;
  isActive: boolean;
  onClick: () => void;
};

const Metric = (metricProps: MetricProps) => {
  const router = useRouter();
  const pathname = window.location.pathname;
  console.log("Current Pathname:", pathname);
  const handleButtonClick = () => {
    metricProps.onClick();
    if (pathname.startsWith("/patient/dashboard/")) {
      router.push(`${pathname}#${metricProps.title}`);
    } else {
      router.push(`/patient/dashboard#${metricProps.title}`);
    }
  };
  const icon = useMemo(() => {
    switch (metricProps.title) {
      case "Math":
        return faSquareRootVariable;
      case "Reading":
        return faBookOpen;
      case "Writing":
        return faFileLines;
      case "Trivia":
        return faCircleQuestion;
      default:
        return faSquareRootVariable; 
    }
  }, [metricProps.title]);

  return (
    <div className={styles.wrapper} onClick={() => handleButtonClick()}>
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}></div>
        <div className={styles["metrics-container"]}>
          <div className={styles["dashboard-icon"]}>
            <FontAwesomeIcon
              className={styles[`analytics-icon-${metricProps.isActive ? "active" : "inactive"}`]}
              icon={icon}
              size="xs"
            />
          </div>
          <div className={styles[`metric-${metricProps.isActive ? "active" : "inactive"}`]}>
            <span>{metricProps.title}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metric;
