"use client";


import React, { useMemo, useState, useEffect } from "react";
import { Poppins } from "next/font/google";
import { usePathname, useRouter } from "next/navigation";
import { SqrtIcon, BookIcon, QuestionIcon, DocIcon } from "@src/app/icons";
import useHash from "@src/hooks/useHash";
import styles from "./Metric.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

type MetricProps = {
  title: string;
  isClickable: boolean;
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
        return (
          <SqrtIcon
            isActive={metricProps.isClickable}
            className={styles[`analytics-icon-${metricProps.isClickable ? "active" : "inactive"}`]}
          />
        );
      case "Reading":
        return (
          <BookIcon
            isActive={metricProps.isClickable}
            className={styles[`analytics-icon-${metricProps.isClickable ? "active" : "inactive"}`]}
          />
        );
      case "Writing":
        return (
          <DocIcon
            isActive={metricProps.isClickable}
            className={styles[`analytics-icon-${metricProps.isClickable ? "active" : "inactive"}`]}
          />
        );
      case "Trivia":
        return (
          <QuestionIcon
            isActive={metricProps.isClickable}
            className={styles[`analytics-icon-${metricProps.isClickable ? "active" : "inactive"}`]}
          />
        );
      default:
        return <></>;
    }
  }, [metricProps.title, metricProps.isClickable]);

  return (
    <div
      className={`${styles.wrapper} ${!metricProps.isClickable ? styles.disabled : ""}`}
      onClick={metricProps.isClickable ? () => handleButtonClick() : undefined}
    >
      <main className={poppins.variable}>
        <div className={styles["text-wrapper"]}></div>
        <div
          className={
            styles[`metrics-container-${isActive ? "active" : "inactive"}`]
          }
        >
          <div className={styles["dashboard-icon"]}>
            {icon}
          </div>
          <div className={styles[`metric-${metricProps.isClickable ? "active" : "inactive"}`]}>
            <span>{metricProps.title}</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Metric;

// "use client";

// import React, { useMemo, useState, useEffect } from "react";
// import { Poppins } from "next/font/google";
// import { usePathname, useRouter } from "next/navigation";
// import { SqrtIcon, BookIcon, QuestionIcon, DocIcon } from "@src/app/icons";
// import useHash from "@src/hooks/useHash";
// import styles from "./Metric.module.css";

// const poppins = Poppins({
//   subsets: ["latin-ext"],
//   variable: "--font-poppins",
//   weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
// });

// type MetricProps = {
//   title: string;
// };

// const Metric = (metricProps: MetricProps) => {
//   const router = useRouter();
//   const currentPath = usePathname();
//   const hash = useHash();
//   const [isClickable, setIsClickable] = useState<boolean>(false);
//   const isActive = useMemo(
//     () =>
//       currentPath.startsWith("/patient/dashboard") &&
//       hash?.toLowerCase() === metricProps.title.toLowerCase(),
//     [currentPath, metricProps.title, hash],
//   );

//   // const isClickable = currentPath.startsWith("/patient/dashboard");
//   useMemo(() => {
//     setIsClickable(currentPath.startsWith("/patient/dashboard"));
//   }, [currentPath]);

//   const handleButtonClick = () => {
//     // setIsClickable(true);
//     if (currentPath.startsWith("/patient/dashboard/")) {
//       router.push(`${currentPath}#${metricProps.title.toLowerCase()}`);
//     } else {
//       router.push(`/patient/dashboard#${metricProps.title.toLowerCase()}`);
//     }
//   };

//   const icon = useMemo(() => {
//     switch (metricProps.title) {
//       case "Math":
//         return (
//           <SqrtIcon
//             // isActive={isActive}
//             isActive={isClickable}
//             className={
//               styles[`analytics-icon-${isClickable ? "active" : "inactive"}`]
//               // styles[`analytics-icon-${isActive ? "active" : "inactive"}`]
//             }
//           />
//         );
//       case "Reading":
//         return (
//           <BookIcon
//             // isActive={isActive}
//             isActive={isClickable}
//             className={
//               styles[`analytics-icon-${isClickable ? "active" : "inactive"}`]

//               // styles[`analytics-icon-${isActive ? "active" : "inactive"}`]
//             }
//           />
//         );
//       case "Writing":
//         return (
//           <DocIcon
//             // isActive={isActive}
//             isActive={isClickable}
//             className={
//               styles[`analytics-icon-${isClickable ? "active" : "inactive"}`]
//               // styles[`analytics-icon-${isActive ? "active" : "inactive"}`]
//             }
//           />
//         );
//       case "Trivia":
//         return (
//           <QuestionIcon
//             // isActive={isActive}
//             isActive={isClickable}
//             className={
//               styles[`analytics-icon-${isClickable ? "active" : "inactive"}`]
//               // styles[`analytics-icon-${isActive ? "active" : "inactive"}`]
//             }
//           />
//         );
//       default:
//         return <></>;
//     }
//   }, [metricProps.title, isActive]);

//   return (
//     // <div className={styles.wrapper} onClick={() => handleButtonClick()}>
//     // <div className={styles.wrapper} onClick={isClickable ? () => handleButtonClick() : undefined}>
//     <div
//       className={`${styles.wrapper} ${!isClickable ? styles.disabled : ""}`}
//       onClick={isClickable ? () => handleButtonClick() : undefined}
//     >
//       <main className={poppins.variable}>
//         <div className={styles["text-wrapper"]}></div>
//         <div
//           className={
//             styles[`metrics-container-${isActive ? "active" : "inactive"}`]
//           }
//         >
//           <div className={styles["dashboard-icon"]}>
//             {icon}
//             {/* <FontAwesomeIcon
//               className={
//                 styles[`analytics-icon-${isActive ? "active" : "inactive"}`]
//               }
//               icon={icon}
//               size="xs"
//             /> */}
//           </div>
//           {/* <div className={styles[`metric-${isActive ? "active" : "inactive"}`]}> */}
//           <div className={styles[`metric-${isClickable ? "active" : "inactive"}`]}>
//             <span>{metricProps.title}</span>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Metric;

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
