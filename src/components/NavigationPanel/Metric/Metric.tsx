import React from "react";
import { Poppins } from "next/font/google";
import { useRouter, usePathname } from "next/navigation";
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
  isActive: string;
};

const Metric = (MetricProps: MetricProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const handleButtonClick = () => {
    if (pathname.startsWith("/patient/dashboard/")) {
      router.push(`${pathname}#${MetricProps.title}`);
    } else {
      router.push(`/patient/dashboard#${MetricProps.title}`);
    }
  };

  let icon;
  switch (MetricProps.title) {
    case "Math":
      icon = faSquareRootVariable;
      break;
    case "Reading":
      icon = faBookOpen;
      break;
    case "Writing":
      icon = faFileLines;
      break;
    case "Trivia":
      icon = faCircleQuestion;
      break;
    default:
      icon = faSquareRootVariable; 
  }

  return (
    <div className={styles.wrapper} onClick={handleButtonClick}>
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}></div>
        <div className={styles[`metrics-container-${MetricProps.isActive}`]}>
          <div className={styles["dashboard-icon"]}>
            <FontAwesomeIcon
              className={styles[`analytics-icon-${MetricProps.isActive}`]}
              icon={icon}
              size="xs"
            />
          </div>
          <div className={styles[`metric-${MetricProps.isActive}`]}>
            <span>{MetricProps.title}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metric;