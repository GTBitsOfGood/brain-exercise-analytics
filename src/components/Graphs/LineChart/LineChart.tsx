"use client";

import { Poppins, Inter } from "next/font/google";
import * as d3 from "d3";
import {
  Fragment,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
  gradient?: boolean;
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
    format: (d: d3.NumberValue) => d3.format(".2f")(d),
  },
  title,
  hoverable = false,
  percentageChange = false,
  gradient = false,
  fullWidth,
  info = "",
  yLabel = "",
  gridLines = false,
}: DataParams) {
  const updateNewData = useCallback(() => {
    const datapoints = 10;
    if (data.length === 0) {
      return [{ interval: "1", value: 1 }];
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [infoPopup, setInfoPopup] = useState(false);
  const [popupX, setPopupX] = useState(0);
  const [popupY, setPopupY] = useState(0);

  const actualChange =
    newData.length < 2
      ? null
      : newData[newData.length - 1].value / newData[newData.length - 2].value -
        1;

  function handleMouseMove(e: MouseEvent) {
    const x = e.pageX;
    const svg: Element = e.currentTarget as SVGElement;
    const svgRect = svg.getBoundingClientRect();
    const xBound = svgRect.x + marginLeft;
    const range = width - marginRight - marginLeft;
    const itemWidth = range / (newData.length - 1);
    const index = Math.floor(
      (x - xBound + Math.floor(itemWidth / 2)) / itemWidth,
    );
    setActiveIndex(index);
  }

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

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
    svg.select(".x-axis-hor").remove();
    svg.select(".y-axis-vert").remove();
    svg.select(".x-axis-grid").remove();
    svg.select(".y-axis-grid").remove();
    svg.select(".x-axis-top").remove();
    svg.select(".x-axis-bottom").remove();
    svg.select(".y-axis").remove();
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
  ]);

  useEffect(() => {
    updateSize();
  }, [newData, updateSize]);

  useEffect(() => {
    setNewData(updateNewData());
  }, [data, updateNewData]);

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
        <div style={{ display: "inline-flex" }}>
          <p className={styles.titleText}>{title}</p>
          {info !== "" && (
            <div
              className={styles.info}
              onClick={() => {
                setInfoPopup(true);
              }}
              ref={infoButtonRef}
            >
              <InfoIcon />
              <PopupModal
                show={infoPopup}
                info="Some information about line chart should come here."
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
            className={styles.percentageChangeIcon}
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
          <p className={styles.percentageChange}>
            {actualChange !== null && percentageChange}
          </p>
        </div>
        <div style={{ display: "inline-flex" }}>
          <p className={styles.labelText}>{yLabel}</p>
        </div>
      </div>
      <svg
        ref={windowRef}
        width={width}
        height={height}
        onMouseMove={hoverable ? handleMouseMove : undefined}
        onMouseLeave={hoverable ? handleMouseLeave : undefined}
        style={{ marginTop: 20 }}
      >
        {gradient && (
          <filter id="drop-shadow" height={"180%"}>
            <feDropShadow
              dx="0"
              dy="13"
              stdDeviation="6"
              floodColor="rgb(216 211 232)"
            />
          </filter>
        )}
        <path
          className={styles.linePath}
          d={line(newData.map((d, i) => [i, d.value])) as string | undefined}
        />
        <g className={styles.svgComp}>
          <circle key={-1} cx={x(0)} cy={y(newData[0].value)} r="2.5" />
          <circle
            key={-2}
            cx={x(newData.length - 1)}
            cy={y(newData[newData.length - 1].value)}
            r="2.5"
          />
          {newData.map(
            (d, i) =>
              activeIndex === i && (
                <Fragment key={i}>
                  <circle
                    className={styles.hoverCircle}
                    cx={x(i)}
                    cy={y(d.value)}
                    r="7.5"
                  />
                  <foreignObject
                    x={x(i) - 7.5}
                    y={y(d.value) - 20}
                    width="20"
                    height="10"
                    fontSize={8}
                  >
                    <div style={{ textAlign: "center", color: "#A5A5A5" }}>
                      {d.value}
                    </div>
                  </foreignObject>
                </Fragment>
              ),
          )}
        </g>
      </svg>
    </div>
  );
}
