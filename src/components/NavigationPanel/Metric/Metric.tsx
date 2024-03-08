import React, { useMemo } from "react";
import { Poppins } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareRootVariable,
  faBookOpen,
  faFileLines,
  faCircleQuestion,
} from "@fortawesome/free-solid-svg-icons";
import useHash from "@src/hooks/useHash";
import styles from "./Metric.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type MetricProps = {
  title: string;
};

const Metric = (metricProps: MetricProps) => {
  const router = useRouter();
  const currentPath = usePathname();
  const hash = useHash();

  const isActive = useMemo(
    () =>
      currentPath.startsWith("/patient/dashboard") &&
      hash?.toLowerCase() === metricProps.title.toLowerCase(),
    [currentPath, metricProps.title, hash],
  );

  const handleButtonClick = () => {
    if (currentPath.startsWith("/patient/dashboard/")) {
      router.push(`${currentPath}#${metricProps.title.toLowerCase()}`);
    } else {
      router.push(`/patient/dashboard#${metricProps.title.toLowerCase()}`);
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
              className={
                styles[`analytics-icon-${isActive ? "active" : "inactive"}`]
              }
              icon={icon}
              size="xs"
            />
          </div>
          <div className={styles[`metric-${isActive ? "active" : "inactive"}`]}>
            <span>{metricProps.title}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metric;
