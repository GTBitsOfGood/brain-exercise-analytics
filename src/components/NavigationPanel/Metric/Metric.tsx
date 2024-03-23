"use client";

import React, { useMemo } from "react";
import { Poppins } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faSquareRootVariable,
//   faBookOpen,
//   faFileLines,
//   faCircleQuestion,
// } from "@fortawesome/free-solid-svg-icons";
import {
  SqrtIcon, 
  BarChartIcon,
  BookIcon,
  QuestionIcon,
  DocIcon,
} from "@src/app/icons"
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
  const isClickable = currentPath.startsWith("/patient/dashboard");

  const handleButtonClick = () => {
    if (currentPath.startsWith("/patient/dashboard/")) {
      router.push(`${currentPath}#${metricProps.title.toLowerCase()}`);
    } else {
      router.push(`/patient/dashboard#${metricProps.title.toLowerCase()}`);
    }
    console.log(isActive);
  };
  // const icon = useMemo(() => {
  //   // switch (metricProps.title) {
  //   //   case "Math":
  //   //     return <SqrtIcon className={`analytics-icon-${isActive ? "active" : "inactive"}`} />;
  //   //     // return faSquareRootVariable;
  //   //   case "Reading":
  //   //     return <BookIcon className={`analytics-icon-${isActive ? "active" : "inactive"}`} />;
  //   //     // return faBookOpen;
  //   //   case "Writing":
  //   //     return <BookIcon className={`analytics-icon-${isActive ? "active" : "inactive"}`} />;
  //   //     // return faFileLines;
  //   //   case "Trivia":
  //   //     return <QuestionIcon className={`analytics-icon-${isActive ? "active" : "inactive"}`} />;
  //   //     // return faCircleQuestion;
  //   //   default:
  //   //     return <BarChartIcon className={`analytics-icon-${isActive ? "active" : "inactive"}`} />;
  //   //     // return faSquareRootVariable;
  //   // }
  //   // switch (metricProps.title) {
  //   //   case "Math":
  //   //     return <SqrtIcon className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //   //   case "Reading":
  //   //     return <BookIcon className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //   //   case "Writing":
  //   //     return <DocIcon className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //   //   case "Trivia":
  //   //     return <QuestionIcon className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //   //   default:
  //   //     return <BarChartIcon className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //   // }
  //   switch (metricProps.title) {
  //     case "Math":
  //       return <SqrtIcon isActive={isActive} className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //     case "Reading":
  //       return <BookIcon isActive={isActive} className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //     case "Writing":
  //       return <DocIcon isActive={isActive} className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //     case "Trivia":
  //       return <QuestionIcon isActive={isActive} className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
  //     default:
  //   }
  // }, [metricProps.title]);

  let icon = null;
  switch (metricProps.title) {
    case "Math":
      icon = <SqrtIcon isActive={isActive} className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
      break;
    case "Reading":
      icon = <BookIcon isActive={isActive} className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
      break;
    case "Writing":
      icon = <DocIcon isActive={isActive} className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
      break;
    case "Trivia":
      icon = <QuestionIcon isActive={isActive} className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]} />;
      break;
    default:
      break;
  }
  

  return (
    // <div className={styles.wrapper} onClick={() => handleButtonClick()}>
    // <div className={styles.wrapper} onClick={isClickable ? () => handleButtonClick() : undefined}>
    <div className={`${styles.wrapper} ${!isClickable ? styles.disabled : ''}`} onClick={isClickable ? () => handleButtonClick() : undefined}>
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}></div>
        <div className={styles[`metrics-container-${isActive ? "active" : "inactive"}`]}>
          <div className={styles["dashboard-icon"]}>
            {icon}
            {/* <FontAwesomeIcon
              className={
                styles[`analytics-icon-${isActive ? "active" : "inactive"}`]
              }
              icon={icon}
              size="xs"
            /> */}
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


// // new stuff
// "use client"
// import React, { useMemo, useEffect } from "react";
// import { Poppins } from "next/font/google";
// import { usePathname, useRouter } from "next/navigation";
// import { SqrtIcon, BookIcon, DocIcon, QuestionIcon } from "@src/app/icons";
// import useHash from "@src/hooks/useHash";
// import styles from "./Metric.module.css";

// const poppins = Poppins({
//   subsets: ["latin-ext"],
//   variable: "--font-poppins",
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });

// interface MetricProps {
//   title: string;
// }

// const Metric = ( metricProps : MetricProps) => {
//   const router = useRouter();
//   const currentPath = usePathname();
//   const hash = useHash();

//   const isActive = useMemo(
//     () =>
//       currentPath.startsWith("/patient/dashboard") &&
//       hash?.toLowerCase() === metricProps.title.toLowerCase(),
//     [currentPath, metricProps.title, hash]
//   );


//   const isClickable = currentPath.startsWith("/patient/dashboard");

//   const handleButtonClick = () => {
//     if (currentPath.startsWith("/patient/dashboard/")) {
//       router.push(`${currentPath}#${metricProps.title.toLowerCase()}`);
//     } else {
//       router.push(`/patient/dashboard#${metricProps.title.toLowerCase()}`);
//     }
//   };
//   useEffect(() => {
//     const handleScroll = () => {
//       const scrollY = window.scrollY;
//       const mathRef = document.getElementById("math");
//       const readingRef = document.getElementById("reading");
//       const writingRef = document.getElementById("writing");
//       const triviaRef = document.getElementById("trivia");
  
//       if (!mathRef || !readingRef || !writingRef || !triviaRef) {
//         return; 
//       }
  
//       if (scrollY < mathRef.offsetTop - 100) {
//         router.push("#overall");
//       } else if (
//         scrollY >= mathRef.offsetTop - 100 &&
//         scrollY < readingRef.offsetTop - 100
//       ) {
//         router.push("#math");
//       } else if (
//         scrollY >= readingRef.offsetTop - 100 &&
//         scrollY < writingRef.offsetTop - 100
//       ) {
//         router.push("#reading");
//       } else if (
//         scrollY >= writingRef.offsetTop - 100 &&
//         scrollY < triviaRef.offsetTop - 100
//       ) {
//         router.push("#writing");
//       } else {
//         router.push("#trivia");
//       }
//     };
  
//     window.addEventListener("scroll", handleScroll);
  
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, [router]);
  

//   let icon = null;
//   switch (metricProps.title) {
//     case "Math":
//       icon = (
//         <SqrtIcon
//           isActive={isActive}
//           className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]}
//         />
//       );
//       break;
//     case "Reading":
//       icon = (
//         <BookIcon
//           isActive={isActive}
//           className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]}
//         />
//       );
//       break;
//     case "Writing":
//       icon = (
//         <DocIcon
//           isActive={isActive}
//           className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]}
//         />
//       );
//       break;
//     case "Trivia":
//       icon = (
//         <QuestionIcon
//           isActive={isActive}
//           className={styles[`analytics-icon-${isActive ? "active" : "inactive"}`]}
//         />
//       );
//       break;
//     default:
//       break;
//   }

//   return (
//     <div
//       className={`${styles.wrapper} ${!isClickable ? styles.disabled : ""}`}
//       onClick={isClickable ? handleButtonClick : undefined}
//     >
//       <main className={poppins.variable}>
//         <div className={styles["text-wrapper"]}></div>
//         <div className={styles[`metrics-container-${isActive ? "active" : "inactive"}`]}>
//           <div className={styles["dashboard-icon"]}>{icon}</div>
//           <div className={styles[`metric-${isActive ? "active" : "inactive"}`]}>
//             <span>{metricProps.title}</span>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Metric;
