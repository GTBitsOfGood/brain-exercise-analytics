"use client";

import { Poppins, Inter } from "next/font/google";
import * as d3 from "d3";
import { MouseEvent, useCallback, useEffect, useRef, useState } from "react";
import { D3Data } from "@src/utils/types";
import { InfoIcon } from "@src/app/icons";
import { DataRecord } from "@/common_utils/types";
import PopupModal from "../PopupModal/PopupModal";
import styles from "./LineChart.module.scss";

const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const inter500 = Inter({ subsets: ["latin"], weight: "500" });

interface DataParams extends D3Data {
  className?: string;
  title: string;
  hoverable?: boolean;
  percentageChange?: boolean;
  info?: string;
  gridLines?: boolean;
  yLabel?: string;
}

export default function LineChart({
  className,
  data,
  width: providedWidth = 410,
  height: providedHeight = 150,
  style = {},
  yAxis = {
    min:
      (d3.min(data.map((v) => v.value)) ?? 0) -
      0.1 *
        ((d3.max(data.map((v) => v.value)) ?? 1) -
          (d3.min(data.map((v) => v.value)) ?? 0)),
    max:
      (d3.max(data.map((v) => v.value)) ?? 1) +
      0.1 *
        ((d3.max(data.map((v) => v.value)) ?? 1) -
          (d3.min(data.map((v) => v.value)) ?? 0)),
    numDivisions: Math.round((Math.max(providedHeight, 100) - 35) / 25),
    format: (d: d3.NumberValue) => d3.format(".1f")(d),
  },
  title,
  hoverable = false,
  percentageChange = false,
  fullWidth,
  info = "",
  yLabel = "",
  gridLines = false,
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
  const minWidth = 210;
  const [width, setWidth] = useState(Math.max(providedWidth, minWidth));
  const windowSizeRef = useRef<null | HTMLDivElement>(null);
  const updateSize = useCallback(() => {
    if (!fullWidth || !windowSizeRef.current) return;
    setWidth(Math.max(windowSizeRef.current.offsetWidth - 45, minWidth));
  }, [fullWidth]);
  const resizeRef = useRef<undefined | NodeJS.Timeout>(undefined);
  const resizeOptimised = () => {
    clearTimeout(resizeRef.current);
    resizeRef.current = setTimeout(updateSize, 500);
  };
  window.addEventListener("resize", resizeOptimised);

  const height = Math.max(providedHeight, 100);
  const infoButtonRef = useRef(null);
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 65;
  const marginLeft = 40;
  const [infoPopup, setInfoPopup] = useState(false);
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);

  const actualChange =
    newData.length < 2 || newData[newData.length - 2].value === 0
      ? null
      : newData[newData.length - 1].value / newData[newData.length - 2].value -
        1;

  const windowRef = useRef(null);

  const y = d3.scaleLinear(
    [yAxis.min, yAxis.max],
    [height - marginBottom, marginTop],
  );

  const x = d3.scaleLinear(
    [0, newData.length - 1],
    [marginLeft, width - marginRight],
  );
  const line = d3
    .line()
    .x((d, i) => x(i))
    .y((d) => y(d[1]))
    .curve(d3.curveCatmullRom);

  useEffect(() => {
    const onScroll = () => setInfoPopup(false);
    // clean up code
    window.removeEventListener("scroll", onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });

    const yAxisFormat = yAxis?.format
      ? yAxis.format
      : (d: d3.NumberValue) => JSON.stringify(d);
    if (infoButtonRef.current) {
      const rect: Element = infoButtonRef.current;
      const newTop = rect.getBoundingClientRect().y - 50;
      setPopupY(newTop);
      const left = rect.getBoundingClientRect().x;
      setPopupX(left);
    }
    const svg = d3.select(windowRef.current);

    if (!dataExists) {
      svg.selectAll("*").remove();

      const iconSVG = `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 40 40" fill="none">
          <path d="M20.0021 3.33594C29.2071 3.33594 36.6688 10.7976 36.6688 20.0026C36.6688 29.2076 29.2071 36.6693 20.0021 36.6693C10.7971 36.6693 3.33545 29.2076 3.33545 20.0026C3.33545 10.7976 10.7971 3.33594 20.0021 3.33594ZM20.0021 6.66927C16.4659 6.66927 13.0745 8.07403 10.574 10.5745C8.07354 13.075 6.66878 16.4664 6.66878 20.0026C6.66878 23.5388 8.07354 26.9302 10.574 29.4307C13.0745 31.9312 16.4659 33.3359 20.0021 33.3359C23.5383 33.3359 26.9297 31.9312 29.4302 29.4307C31.9307 26.9302 33.3354 23.5388 33.3354 20.0026C33.3354 16.4664 31.9307 13.075 29.4302 10.5745C26.9297 8.07403 23.5383 6.66927 20.0021 6.66927ZM20.0021 25.0026C20.4441 25.0026 20.8681 25.1782 21.1806 25.4908C21.4932 25.8033 21.6688 26.2272 21.6688 26.6693C21.6688 27.1113 21.4932 27.5352 21.1806 27.8478C20.8681 28.1603 20.4441 28.3359 20.0021 28.3359C19.5601 28.3359 19.1362 28.1603 18.8236 27.8478C18.511 27.5352 18.3354 27.1113 18.3354 26.6693C18.3354 26.2272 18.511 25.8033 18.8236 25.4908C19.1362 25.1782 19.5601 25.0026 20.0021 25.0026ZM20.0021 10.0026C20.4441 10.0026 20.8681 10.1782 21.1806 10.4908C21.4932 10.8033 21.6688 11.2272 21.6688 11.6693V21.6693C21.6688 22.1113 21.4932 22.5352 21.1806 22.8478C20.8681 23.1603 20.4441 23.3359 20.0021 23.3359C19.5601 23.3359 19.1362 23.1603 18.8236 22.8478C18.511 22.5352 18.3354 22.1113 18.3354 21.6693V11.6693C18.3354 11.2272 18.511 10.8033 18.8236 10.4908C19.1362 10.1782 19.5601 10.0026 20.0021 10.0026Z" fill="#F30000"/>
        </svg>
      `;
      const iconSize = 30;

      svg
        .append("foreignObject")
        .attr("x", width / 2 - 97)
        .attr("y", height / 2 - 37) // Position above the "No Data" text
        .attr("width", iconSize)
        .attr("height", iconSize)
        .html(iconSVG);

      svg
        .append("text")
        .attr("x", width / 2)
        .attr("y", height / 2 - 20)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", "16px")
        .style("font-family", poppins500.style.fontFamily)
        .style("fill", "#2B3674")
        .text("No Data Found");
    } else {
      svg.select(".x-axis-hor").remove();
      svg.select(".y-axis-vert").remove();
      svg.select(".x-axis-grid").remove();
      svg.select(".y-axis-grid").remove();
      svg.select(".x-axis-top").remove();
      svg.select(".x-axis-bottom").remove();
      svg.select(".y-axis").remove();
      svg.select(".path").remove();
      svg.select(".point").remove();
      svg.selectAll("*").remove();

      const xAxisLabelTop = d3
        .axisBottom(x)
        .ticks(newData.length - 1)
        .tickSizeOuter(0)
        .tickSizeInner(0)
        .tickPadding(15)
        .tickFormat((d) => newData[d.valueOf()].interval.split(" ")[0]);

      const xAxisLabelBottom = d3
        .axisBottom(x)
        .ticks(newData.length - 1)
        .tickSizeOuter(0)
        .tickSizeInner(0)
        .tickPadding(15)
        .tickFormat((d) => newData[d.valueOf()].interval.split(" ")[1]);

      let yTickValues = d3.range(
        yAxis.min,
        yAxis.max + 0.000001,
        (yAxis.max - yAxis.min) / (yAxis.numDivisions - 1),
      );

      if (yTickValues[0] < 0) {
        yTickValues = yTickValues.slice(1);
      }
      const yAxisLabel = d3
        .axisLeft(y)
        .tickValues(yTickValues)
        .tickSizeOuter(0)
        .tickSizeInner(0)
        .tickPadding(15)
        .tickFormat(yAxisFormat);
      if (gridLines) {
        const yAxisGrid = d3
          .axisLeft(y)
          .tickValues(yTickValues)
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
        .attr("transform", `translate(0, ${height - marginBottom})`)
        .attr("class", "x-axis-top")
        .style("font", `10px ${poppins500.style.fontFamily}`)
        .style("color", "#343539")
        .call(xAxisLabelTop)
        .call((g) => g.select(".domain").remove());

      svg
        .append("g")
        .attr("transform", `translate(0, ${height - marginBottom + 15})`)
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

      const d3line = line(newData.map((d, i) => [i, d.value])) as string;

      const tooltip = d3.select("#tooltip");
      // Draw the line connecting the points

      svg
        .append("path")
        .datum(newData) // Bind data to the path
        .attr("class", styles.linePath) // Add a class for styling
        .attr("d", d3line) // Create the line using the defined line function
        .style("fill", "none") // No fill for the line
        .style("stroke", "#008AFC") // Line color
        .style("stroke-width", 5) // Line width
        .style("stroke-linecap", "round")
        .style("stroke-linejoin", "round")
        .style("filter", "url(#drop-shadow)");

      // Draw points as circles on the line
      if (hoverable) {
        svg
          .selectAll(".point")
          .data(newData)
          .join("circle")
          .attr("class", styles.hoverCircle)
          .attr("cx", (d, i) => x(i)) // X position based on index
          .attr("cy", (d) => y(d.value)) // Y position based on the value
          .attr("r", 7) // Radius of the circles
          .style("fill", "white") // Set fill color to white
          .style("stroke", "#008AFC") // Set stroke color
          .style("stroke-width", 5) // Set stroke width
          .style("opacity", 0) // Initially hidden

          .on(
            "mouseover",
            function handleMouseOver(event: MouseEvent, d: DataRecord) {
              tooltip.transition().duration(0).style("opacity", 1);
              tooltip
                .html(
                  `${Number.isInteger(d.value) ? d.value : d.value.toFixed(2)}`,
                )
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);

              // Show the circle when hovered over the line
              d3.select(this).style("opacity", 1); // Set opacity to 1
            },
          )
          .on("mousemove", (event: MouseEvent) => {
            tooltip
              .style("left", `${event.pageX + 5}px`)
              .style("top", `${event.pageY - 28}px`);
          })
          .on("mouseout", function handleMouseOut() {
            tooltip.transition().duration(0).style("opacity", 0);

            // Hide the circle when not hovering
            d3.select(this).style("opacity", 0); // Set opacity back to 0
          });
      }
    }

    return () => window.removeEventListener("scroll", onScroll);
  }, [
    width,
    newData,
    height,
    x,
    y,
    yAxis.format,
    yAxis.max,
    yAxis.min,
    yAxis.numDivisions,
    gridLines,
    dataExists,
  ]);

  useEffect(() => {
    updateSize();
  }, [newData, updateSize]);

  useEffect(() => {
    setNewData(updateNewData());
  }, [data, updateNewData]);

  useEffect(() => {
    setDataExists(newData.length !== 0);
  }, [newData]);

  return (
    <div
      className={`${className} ${styles.LineChart}`}
      style={{
        width: fullWidth ? "100%" : width + 45,
        minWidth: fullWidth ? minWidth + 45 : undefined,
        height: height + 60,
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
        <div className={styles.leftSide}>
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
        </div>
        <div className={styles.rightSide}>
          <p
            className={styles.percentageChange}
            style={{
              color:
                actualChange !== null && actualChange < 0
                  ? "#EA4335"
                  : "#05CD99",
              whiteSpace: "nowrap",
            }}
          >
            {actualChange !== null &&
              percentageChange &&
              (actualChange < 0
                ? `⏷ ${(actualChange * 100).toFixed(2)}%`
                : `⏶ ${(actualChange * 100).toFixed(2)}%`)}
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
        style={{ marginTop: 20 }}
      >
        <filter id="drop-shadow" height={"180%"}>
          <feDropShadow
            dx="0"
            dy="13"
            stdDeviation="6"
            floodColor="rgb(216 211 232)"
          />
        </filter>
      </svg>
    </div>
  );
}
