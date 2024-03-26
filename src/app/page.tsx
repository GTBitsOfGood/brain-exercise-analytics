// "use client";

export default function Home() {
  return <></>;
}
// import {
//   // BarChart,
//   LineChart,
//   // StackedBarChart,
//   SmallDataBox,
// } from "@src/components/Graphs";

// import { Days } from "@/common_utils/types";
// import MathScreen from "@src/components/Dashboard/MathScreen/MathScreen";
// import {
//   OverviewReport,
//   OverallDashboard,
//   ReadingScreen,
//   WritingScreen,
//   TriviaScreen,
// } from "@src/components/Dashboard";
// import styles from "./page.module.css";
// import { PersonIcon } from "./icons";

// const numberOfQuestionData = [
//   {
//     interval: "9/17",
//     value: 25,
//   },
//   {
//     interval: "9/24",
//     value: 30,
//   },
//   {
//     interval: "10/4",
//     value: 15,
//   },
//   {
//     interval: "10/11",
//     value: 10,
//   },
//   {
//     interval: "10/18",
//     value: 10,
//   },
//   {
//     interval: "10/25",
//     value: 8,
//   },
//   {
//     interval: "11/01",
//     value: 4,
//   },
// ];

// const dataLine = [
//   {
//     interval: "9/17",
//     value: 0.4,
//   },
//   {
//     interval: "9/24",
//     value: 0.23,
//   },
//   {
//     interval: "10/4",
//     value: 0.01,
//   },
//   {
//     interval: "10/12",
//     value: 0.25,
//   },
//   {
//     interval: "10/19",
//     value: 0.7,
//   },
//   {
//     interval: "10/25",
//     value: 0.55,
//   },
// ];
// const dataBar = [
//   {
//     interval: "9/17",
//     value: 0,
//   },
//   {
//     interval: "9/24",
//     value: 2,
//   },
//   {
//     interval: "10/4",
//     value: 1,
//   },
//   {
//     interval: "10/12",
//     value: 6,
//   },
//   {
//     interval: "10/19",
//     value: 5,
//   },
//   {
//     interval: "10/25",
//     value: 7,
//   },
// ];
// const dataStacked = [
//   {
//     interval: "9/17",
//     stackedValue: 0.3,
//     value: 0.5,
//   },
//   {
//     interval: "9/24",
//     stackedValue: 0.1,
//     value: 0.2,
//   },
//   {
//     interval: "10/4",
//     stackedValue: 0.1,
//     value: 0.7,
//   },
//   {
//     interval: "10/12",
//     stackedValue: 0.55,
//     value: 0.6,
//   },
//   {
//     interval: "10/19",
//     stackedValue: 0.2,
//     value: 0.5,
//   },
//   {
//     interval: "10/25",
//     stackedValue: 0.0,
//     value: 0.8,
//   },
// ];

// export default function Home() {
//   return (
//     <main className={styles.main}>
//       {/* <OverviewReport activeUsers={10} totalUsers={200} />
//       <div
//         style={{
//           marginTop: "50px",
//           marginBottom: "50px",
//           width: "100%",
//           borderTop: "1px solid #C8C8C8",
//         }}
//       />
//       <OverallDashboard
//         streak={[Days.Monday, Days.Tuesday, Days.Friday]}
//         startDate={new Date("2020-12-10")}
//         endDate={new Date("2023-07-23")}
//         sessionCompletionHistory={dataBar}
//       />
//       <LineChart
//         style={{ marginTop: "100px" }}
//         title="Accuracy"
//         data={dataLine}
//         yAxis={{
//           min: 0,
//           max: 1,
//           numDivisions: 5,
//           format: (d) => `${JSON.stringify(Math.round(100 * d.valueOf()))}%`,
//         }}
//         hoverable
//         percentageChange
//         gradient
//       />
//       <SmallDataBox
//         title={"Number of questions completed"}
//         Icon={PersonIcon}
//         text={"20 / 1 hr 50 min"}
//       />
//       <div>
//         <MathScreen
//           accuracyData={dataLine}
//           difficultyData={dataLine}
//           numQuestionData={numberOfQuestionData}
//           timeData={dataBar}
//           currentAccuracy="30%"
//           currentDifficulty="50%"
//           totalQuestions="20"
//           totalTime="1min 30sec"
//         />
//         <ReadingScreen
//           sessionHistory={dataStacked}
//           readingRate={dataLine}
//           avgPassage={dataBar}
//           timeData={dataBar}
//           totalPassage={"10"}
//           currentTime={"30 sec"}
//           completionStatus={true}
//         />
//         <WritingScreen
//           sessionHistory={dataStacked}
//           numCompleted={dataBar}
//           avgTime={dataBar}
//           totalPrompts={"10"}
//           currentTime={"2 min 20 sec"}
//           attemptStatus={false}
//         />
//         <TriviaScreen
//           accuracyData={dataLine}
//           numQuestionData={numberOfQuestionData}
//           timeData={dataBar}
//           currentAccuracy="65%"
//           totalQuestions="10"
//           totalTime="3 min 15 sec"
//         />
//       </div> */}
//       {
//         // <main className={styles.main}>
//         //   <LineChart
//         //     title="Accuracy"
//         //     data={dataLine}
//         //     yAxis={{
//         //       min: 0,
//         //       max: 1,
//         //       numDivisions: 9,
//         //       format: (d) => `${JSON.stringify(Math.round(100 * d.valueOf()))}%`,
//         //     }}
//         //     hoverable
//         //     percentageChange
//         //     gradient
//         //   />
//         //   <BarChart
//         //     title="Reading Volume Analysis"
//         //     data={dataBar}
//         //     yAxis={{
//         //       min: 0,
//         //       max: 7,
//         //       numDivisions: 5,
//         //       format: (d) => {
//         //         if (d.valueOf() === 0) {
//         //           return JSON.stringify(d);
//         //         }
//         //         if (d.valueOf() <= 2) {
//         //           return "1-2";
//         //         }
//         //         if (d.valueOf() <= 4) {
//         //           return "3-4";
//         //         }
//         //         if (d.valueOf() <= 6) {
//         //           return "5-6";
//         //         }
//         //         return "6+";
//         //       },
//         //     }}
//         //     hoverable
//         //     percentageChange
//         //   />
//         //   <StackedBarChart
//         //     title="Session Completions"
//         //     data={dataStacked}
//         //     hoverable
//         //     percentageChange
//         //   />
//         //   <SmallDataBox
//         //     title={"Number of questions completed"}
//         //     Icon={Icon}
//         //     text={"20 / 1 hr 50 min"}
//         //   />
//         //   {/* <Dropdown props={dropdownProps} /> */}
//         //   <DateSelector />
//         //   <BooleanBox
//         //     title="Attempted or not"
//         //     greenText="ATTEMPTED"
//         //     redText="NOT ATTEMPTED"
//         //     showGreen={true}
//         //     Icon={Icon}
//         //   />
//         //   {/* <BarChart data={data} /> */}
//       }
//     </main>
//   );
// }
