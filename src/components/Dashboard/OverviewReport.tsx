import { personIcon, peopleIcon } from "@src/app/icons";
import { CSSProperties, useState } from "react";
import { LineChart, SmallDataBox } from "../Graphs";
import styles from "./OverviewReport.module.css";

interface Params {
  activeUsers: number;
  totalUsers: number;
  style?: CSSProperties;
}
// Need data to pass to Linechart

export default function OverviewReport(params: Params) {
  const [showGraph, setShowGraph] = useState<boolean>(false);
  return (
    <div
      style={{
        height: 164,
        width: "100%",
        ...params.style,
      }}
    >
      <p className={styles.TitleTypography}>Overview / Report</p>
      <div className={styles.DataGrid}>
        <SmallDataBox
          title={"Active Users"}
          Icon={personIcon}
          titleAboveText
          text={`${params.activeUsers} / ${params.totalUsers}`}
          style={{
            boxShadow:
              "12.02189px 14.59801px 34.34826px 3.43483px rgba(112, 144, 176, 0.08)",
          }}
        />
        <div
          onMouseEnter={() => setShowGraph(true)}
          onMouseLeave={() => setShowGraph(false)}
        >
          <SmallDataBox
            title={"Total Users"}
            Icon={peopleIcon}
            titleAboveText
            text={`${params.totalUsers}`}
            style={{
              boxShadow:
                "12.02189px 14.59801px 34.34826px 3.43483px rgba(112, 144, 176, 0.08)",
            }}
          />
          {showGraph && (
            <LineChart
              width={250}
              height={150}
              title="New Users Over Time"
              data={[
                {
                  interval: "9/17",
                  value: 0.4,
                },
                {
                  interval: "10/17",
                  value: 0.6,
                },
              ]}
              style={{
                position: "absolute",
                marginTop: "-200px",
                marginLeft: "200px",
                width: "305px",
                height: "254px",
              }}
              percentageChange
            />
          )}
        </div>
      </div>
    </div>
  );
}
