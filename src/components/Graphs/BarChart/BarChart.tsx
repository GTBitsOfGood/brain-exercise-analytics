"use client";

import { Poppins, Inter } from "next/font/google";
import { InfoIcon } from "@src/app/icons";
import * as d3 from "d3";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { D3Data } from "@src/utils/types";
import { DataRecord } from "@/common_utils/types";
import PopupModal from "../PopupModal/PopupModal";
import styles from "./BarChart.module.scss";

const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const inter500 = Inter({ subsets: ["latin"], weight: "500" });

interface DataParams extends D3Data {
  className?: string;
  title: string;
  hoverable?: boolean;
  percentageChange?: boolean;
  highlightLargest?: boolean;
  yLabel?: string;
  gridLines?: boolean;
  info?: string;
}

export default function BarChart({
  className,
  title,
  data,
  width: providedWidth = 375,
  height: providedHeight = 180,
  style = {},
  yAxis = {
    min: Math.ceil(0),
    max: Math.floor(d3.max(data.map((v) => v.value + v.value / 5)) ?? 1),
    numDivisions: Math.min(
      5,
      Math.floor(d3.max(data.map((v) => v.value)) ?? 1) + 1,
    ),
    format: d3.format("d"),
  },
  hoverable = false,
  percentageChange = false,
  highlightLargest = true,
  fullWidth = false,
  gridLines = false,
  info = "",
  yLabel = "",
}: DataParams) {
  const updateNewData = useCallback(() => {
    const datapoints = 10;
    if (data.length === 0) {
      return [];
    }
    if (data.length > datapoints) {
      const step = Math.floor(data.length / datapoints);
      const tmp = [];
      for (let i = 0; i < datapoints; i += 1) {
        tmp[datapoints - 1 - i] = data[data.length - i * step - 1];
      }
      return tmp;
    }
    return data;
  }, [data]);
  const [newData, setNewData] = useState<DataRecord[]>(updateNewData());
  const [dataExists, setDataExists] = useState(newData.length !== 0);
  const barWidth = 12;
  const minWidth = (barWidth + 5) * newData.length + 60;
  const [width, setWidth] = useState(Math.max(providedWidth, minWidth));
  const windowSizeRef = useRef<null | HTMLDivElement>(null);
  const updateSize = useCallback(() => {
    if (!fullWidth || !windowSizeRef.current) return;
    setWidth(Math.max(windowSizeRef.current.offsetWidth - 44, minWidth));
  }, [fullWidth, minWidth]);
  const resizeRef = useRef<undefined | NodeJS.Timeout>(undefined);
  const resizeOptimised = () => {
    clearTimeout(resizeRef.current);
    resizeRef.current = setTimeout(updateSize, 500);
  };
  window.addEventListener("resize", resizeOptimised);

  const height = Math.max(providedHeight, 80);
  const infoButtonRef = useRef(null);
  const marginTop = 20;
  const marginRight = 25;
  const marginBottom = 40;
  const marginLeft = 35;
  const [largest, setLargest] = useState(-1);
  const [infoPopup, setInfoPopup] = useState(false);
  const [popupX, setPopupX] = useState<number | null>(null);
  const [popupY, setPopupY] = useState<number | null>(null);

  const actualChange =
    newData.length < 2 || newData[newData.length - 2].value === 0
      ? null
      : newData[newData.length - 1].value / newData[newData.length - 2].value -
        1;

  const windowRef = useRef(null);

  const x = d3.scaleLinear(
    [0, newData.length - 1],
    [marginLeft, width - marginRight],
  );
  const y = d3.scaleLinear(
    [yAxis.min, yAxis.max],
    [height - marginBottom, marginTop],
  );

  useEffect(() => {
    const onScroll = () => setInfoPopup(false);
    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    if (infoButtonRef.current) {
      const rect: Element = infoButtonRef.current;
      const newTop = rect.getBoundingClientRect().y - 50;
      setPopupY(newTop);
      const left = rect.getBoundingClientRect().x;
      setPopupX(left);
    }

    const yAxisFormat = yAxis?.format
      ? yAxis.format
      : (d: d3.NumberValue) => JSON.stringify(d);
    function indexOfMax() {
      if (newData.length === 0) {
        return -1;
      }

      let max = newData[0].value;
      let maxIndex = 0;

      for (let i = 1; i < newData.length; i += 1) {
        if (newData[i].value > max) {
          maxIndex = i;
          max = newData[i].value;
        }
      }

      return maxIndex;
    }
    setLargest(indexOfMax());

    const svg = d3.select(windowRef.current);
    svg.select(".x-axis-hor").remove();
    svg.select(".y-axis-vert").remove();
    svg.select(".x-axis-grid").remove();
    svg.select(".y-axis-grid").remove();
    svg.select(".x-axis-top").remove();
    svg.select(".x-axis-bottom").remove();
    svg.select(".y-axis").remove();
    svg.selectAll(".bar").remove();

    const xAxisLabelTop = d3
      .axisBottom(x)
      .ticks(newData.length)
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(15)
      .tickFormat((d) => newData[d.valueOf()]?.interval?.split(" ")[0] ?? "");

    const xAxisLabelBottom = d3
      .axisBottom(x)
      .ticks(newData.length)
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(15)
      .tickFormat((d) => newData[d.valueOf()]?.interval?.split(" ")[1] ?? "");

    const yAxisLabel = d3
      .axisLeft(y)
      .tickValues(
        d3.range(
          yAxis.min,
          yAxis.max + 0.000001,
          (yAxis.max - yAxis.min) / (yAxis.numDivisions - 1),
        ),
      )
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(15)
      .tickFormat(yAxisFormat);

    if (gridLines) {
      const yAxisGrid = d3
        .axisLeft(y)
        .tickValues(
          d3.range(
            yAxis.min,
            yAxis.max + 0.000001,
            (yAxis.max - yAxis.min) / (yAxis.numDivisions - 1),
          ),
        )
        .tickSize(-width + marginLeft + marginRight - 20)
        .tickFormat(() => "");

      const axisVert = d3
        .axisLeft(y)
        .tickValues(
          d3.range(
            yAxis.min,
            yAxis.max,
            (yAxis.max - yAxis.min) / (yAxis.numDivisions - 1),
          ),
        )
        .tickSize(0)
        .tickFormat(() => "");

      const axisHor = d3
        .axisBottom(
          d3.scaleLinear(
            [0, newData.length - 1],
            [marginLeft, width - marginRight + 20],
          ),
        )
        .ticks(newData.length - 1)
        .tickSizeOuter(0)
        .tickSizeInner(0)
        .tickFormat(() => "");

      svg
        .append("g")
        .attr("class", `y-axis-vert`)
        .attr("transform", `translate(${marginLeft - 5}, 0)`)
        .call(axisVert);

      svg
        .append("g")
        .attr("class", `y-axis-grid ${styles.yAxis}`)
        .attr("transform", `translate(${marginLeft - 5}, 0)`)
        .call(yAxisGrid);

      svg
        .append("g")
        .attr("transform", `translate(-5, ${height - marginBottom})`)
        .attr("class", "x-axis-hor")
        .style("font", `10px ${poppins500.style.fontFamily}`)
        .call(axisHor);
    }

    svg
      .append("g")
      .attr("transform", `translate(${barWidth / 2}, ${height - marginBottom})`)
      .attr("class", "x-axis-top")
      .style("font", `10px ${poppins500.style.fontFamily}`)
      .style("color", "#343539")
      .call(xAxisLabelTop)
      .call((g) => g.select(".domain").remove());

    svg
      .append("g")
      .attr(
        "transform",
        `translate(${barWidth / 2}, ${height - marginBottom + 15})`,
      )
      .attr("class", "x-axis-bottom")
      .style("font", `10px ${inter500.style.fontFamily}`)
      .style("color", "#B0BBD5")
      .call(xAxisLabelBottom)
      .call((g) => g.select(".domain").remove());

    svg
      .append("g")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .attr("class", "y-axis")
      .style("font", `9.5px ${poppins400.style.fontFamily}`)
      .style("color", "#A5A5A5")
      .call(yAxisLabel)
      .call((g) => g.select(".domain").remove());

    const barsGroup = svg
      .selectAll(".bar")
      .data(newData)
      .join("g")
      .attr("class", "bar")
      .attr("transform", (d, i) => `translate(${x(i)}, 0)`); // Position bars

    const tooltip = d3.select("#tooltip");

    if (hoverable) {
      barsGroup
        .append("path")
        .attr("d", (d) => {
          const barHeight = height - marginBottom - y(d.value);
          const radius = barWidth / 2; // Radius for the semi-circle top
          const x0 = 0;
          const y0 = y(d.value);

          // Define the path for a rectangle with a semi-circle top
          if (d.value === 0) {
            // Render a semi-circle (half-circle) if the value is 0
            return `
                  M ${x0},${y0}
                  A ${radius},${radius} 0 1 1 ${x0 + barWidth},${y0}
              `;
          }
          // Render a rectangle with a rounded top if the value is non-zero
          return `
                  M ${x0},${y0 + barHeight} 
                  V ${y0 + radius} 
                  A ${radius},${radius} 0 0 1 ${x0 + barWidth},${y0 + radius} 
                  V ${y0 + barHeight} 
                  H ${x0} Z
              `;
        })
        .style("fill", (d, i) =>
          highlightLargest && largest === i ? "#FF9FB3" : "#008AFC",
        )
        .on("mouseover", (event: MouseEvent, d: DataRecord) => {
          tooltip.transition().duration(0).style("opacity", 1);
          tooltip
            .html(`${d.value}`)
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mousemove", (event: MouseEvent) => {
          tooltip
            .style("left", `${event.pageX + 5}px`)
            .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
          tooltip.transition().duration(0).style("opacity", 0);
        });
    } else {
      barsGroup
        .append("path")
        .attr("d", (d) => {
          const barHeight = height - marginBottom - y(d.value);
          const radius = barWidth / 2; // Radius for the semi-circle top
          const x0 = 0;
          const y0 = y(d.value);

          // Define the path for a rectangle with a semi-circle top
          if (d.value === 0) {
            // Render a semi-circle (half-circle) if the value is 0
            return `
                  M ${x0},${y0}
                  A ${radius},${radius} 0 1 1 ${x0 + barWidth},${y0}
              `;
          }
          // Render a rectangle with a rounded top if the value is non-zero
          return `
                  M ${x0},${y0 + barHeight} 
                  V ${y0 + radius} 
                  A ${radius},${radius} 0 0 1 ${x0 + barWidth},${y0 + radius} 
                  V ${y0 + barHeight} 
                  H ${x0} Z
              `;
        })
        .style("fill", (d, i) =>
          highlightLargest && largest === i ? "#FF9FB3" : "#008AFC",
        );
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, [
    newData,
    height,
    windowRef,
    x,
    y,
    yAxis.format,
    yAxis.max,
    yAxis.min,
    yAxis.numDivisions,
    gridLines,
    width,
    dataExists,
  ]);

  useEffect(() => {
    updateSize();
  }, [newData, updateSize]);

  useEffect(() => {
    setNewData(updateNewData());
    setDataExists(newData.length !== 0);
  }, [data, updateNewData]);

  return (
    <div
      className={`${className} ${styles.BarChart}`}
      style={{
        width: fullWidth ? "100%" : width + 44,
        minWidth: fullWidth ? minWidth + 44 : undefined,
        height: height + 70,
        ...style,
      }}
      ref={windowSizeRef}
      onClick={() => {
        if (infoPopup) {
          setInfoPopup(false);
        }
      }}
    >
      <div className={styles.titleBox}>
        <div style={{ display: "inline-flex" }}>
          <p className={styles.titleText}>{title}</p>
          {info !== "" && (
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
                info={info}
                style={{
                  position: "fixed",
                  top: `${popupY}px`,
                  zIndex: 500,
                  left: `${popupX}px`,
                }}
              />
            </div>
          )}
          <p
            className={styles.percentageChange}
            style={{
              color:
                actualChange !== null && actualChange < 0
                  ? "#EA4335"
                  : "#05CD99",
            }}
          >
            {actualChange !== null &&
              percentageChange &&
              (actualChange < 0
                ? `⏷ \xa0 ${(actualChange * 100).toFixed(2)}%`
                : `⏶ \xa0 ${(actualChange * 100).toFixed(2)}%`)}
          </p>
        </div>
        <div style={{ display: "inline-flex" }}>
          <p className={styles.labelText}>{yLabel}</p>
        </div>
      </div>
      <div
        id="tooltip"
        style={{
          fontFamily: poppins500.style.fontFamily,
          fontWeight: "normal",
          color: "#2b3674",
          position: "absolute",
          opacity: 0,
          pointerEvents: "none",
          backgroundColor: "white",
          border: "1px solid #ccc",
          paddingLeft: "10px",
          paddingRight: "10px",
          borderRadius: "12px",
        }}
      ></div>
      <svg
        ref={windowRef}
        width={width}
        height={height}
        style={{ marginTop: 10 }}
      ></svg>
      <div style={{ justifyContent: "center" }}>
        <div></div>
      </div>
    </div>
  );
}
