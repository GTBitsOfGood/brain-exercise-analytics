"use client";

import * as d3 from "d3";
import { Fragment, useEffect, useRef, useState } from "react";
import { D3Data } from "@src/utils/types";
import { StackedDataRecord } from "@/common_utils/types";
import BarChart from "../BarChart/BarChart";
import styles from "./StackedBarChart.module.scss";

interface DataParams extends D3Data {
  data: StackedDataRecord[];
  title: string;
  hoverable?: boolean;
  percentageChange?: boolean;
  info?: string;
  legend: { text: string; color: string }[];
}

export default function StackedBarChart({
  title,
  data,
  width: providedWidth = 375,
  height: providedHeight = 180,
  style = {},
  yAxis = {
    min: 0,
    max: 1,
    numDivisions: Math.round((Math.max(providedHeight, 100) - 35) / 25),
    format: (d: d3.NumberValue) => d3.format(".2f")(d),
  },
  hoverable = false,
  percentageChange = false,
  legend,
  fullWidth = false,
  info = "",
}: DataParams) {
  const barWidth = 20;
  // Same rules as BarChart
  const [width, setWidth] = useState(
    Math.max(providedWidth, (barWidth + 5) * data.length + 60),
  );
  const windowSizeRef = useRef<null | HTMLDivElement>(null);
  const updateSize = () => {
    if (!fullWidth || !windowSizeRef.current) return;
    setWidth(windowSizeRef.current.offsetWidth - 44);
  };
  const resizeRef = useRef<undefined | NodeJS.Timeout>(undefined);
  const resizeOptimised = () => {
    clearTimeout(resizeRef.current);
    resizeRef.current = setTimeout(updateSize, 500);
  };
  window.addEventListener("resize", resizeOptimised);
  const height = Math.max(providedHeight, 80);
  const marginTop = 20;
  const marginRight = 25;
  const marginBottom = 25;
  const marginLeft = 35;
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight],
  );
  const y = d3.scaleLinear(
    [yAxis.min, yAxis.max],
    [height - marginBottom, marginTop],
  );
  useEffect(() => {
    resizeOptimised();
  }, []);
  return (
    <div
      className={styles.StackedBarChart}
      style={{ width: fullWidth ? "100%" : "fit-content" }}
      ref={windowSizeRef}
    >
      <BarChart
        title={title}
        data={data}
        width={width}
        height={height}
        style={style}
        yAxis={yAxis}
        hoverable={hoverable}
        percentageChange={percentageChange}
        info={info}
        fullWidth
      >
        {data.map((d, i) => (
          <Fragment key={i}>
            <rect
              x={x(i)}
              y={y(d.value)}
              width={barWidth}
              height={height - y(d.value - d.stackedValue) - marginBottom}
              color={"#FF9FB3"}
              style={{ borderRadius: 10 }}
            />
            <circle
              cx={x(i) + barWidth / 2}
              cy={y(d.value)}
              width={barWidth}
              r={barWidth / 2}
              color={d.value === d.stackedValue ? "#008AFC" : "#FF9FB3"}
            />
            <rect
              x={x(i)}
              y={y(d.stackedValue)}
              width={barWidth}
              height={height - y(d.stackedValue) - marginBottom}
              color={"#008AFC"}
              style={{ borderRadius: 10 }}
            />
            <rect
              x={x(i)}
              y={y(yAxis.min)}
              width={barWidth}
              height={barWidth / 2}
              color="white"
              style={{ borderRadius: 10 }}
            />
          </Fragment>
        ))}
      </BarChart>
      <div className={styles.legendBox}>
        <div>
          {legend.map((l) => (
            <div className={styles.legendItem} key={l.text}>
              <div
                className={styles.emptyDiv}
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 50,
                  backgroundColor: l.color,
                }}
              />
              <div className={styles.legendText}>{l.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
