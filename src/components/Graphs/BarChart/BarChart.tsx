"use client";

import { Poppins, Inter } from "next/font/google";
import { InfoIcon } from "@src/app/icons";
import * as d3 from "d3";
import {
  Fragment,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { D3Data } from "@src/utils/types";
import PopupModal from "../PopupModal/PopupModal";
import styles from "./BarChart.module.scss";

const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const inter500 = Inter({ subsets: ["latin"], weight: "500" });

interface DataParams extends D3Data {
  title: string;
  hoverable?: boolean;
  percentageChange?: boolean;
  highlightLargest?: boolean;
  children?: ReactNode;
  info?: string;
}

export default function BarChart({
  title,
  data,
  width: providedWidth = 375,
  height: providedHeight = 180,
  style = {},
  yAxis = {
    min: d3.min(data.map((v) => v.value)) ?? 0,
    max: d3.max(data.map((v) => v.value + 0.00001)) ?? 1,
    numDivisions: Math.round((Math.max(providedHeight, 100) - 35) / 25),
    format: (d: d3.NumberValue) => d3.format(".2f")(d),
  },
  hoverable = false,
  percentageChange = false,
  highlightLargest = true,
  fullWidth = false,
  children,
  info = "",
}: DataParams) {
  const barWidth = 12;
  const minWidth = (barWidth + 5) * data.length + 60;
  const [width, setWidth] = useState(Math.max(providedWidth, minWidth));
  const windowSizeRef = useRef<null | HTMLDivElement>(null);
  const updateSize = () => {
    if (!fullWidth || !windowSizeRef.current) return;
    setWidth(Math.max(windowSizeRef.current.offsetWidth - 44, minWidth));
  };
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
  const [activeIndex, setActiveIndex] = useState(-1);
  const [infoPopup, setInfoPopup] = useState(false);
  const [popupX, setPopupX] = useState<number | null>(null);
  const [popupY, setPopupY] = useState<number | null>(null);

  const actualChange =
    data.length < 2
      ? null
      : data[data.length - 1].value / data[data.length - 2].value - 1;

  const windowRef = useRef(null);

  function handleMouseMove(e: MouseEvent<SVGSVGElement>) {
    const x = e.pageX;
    const svg: Element = e.currentTarget as SVGElement;
    const svgRect = svg.getBoundingClientRect();
    const xBound = svgRect.x + marginLeft;
    const range = width - marginRight - marginLeft;
    const itemWidth = range / (data.length - 1);
    const index = Math.floor(
      (x - xBound + Math.floor(itemWidth / 2)) / itemWidth,
    );
    setActiveIndex(index);
  }

  const handleMouseLeave = () => {
    setActiveIndex(-1);
  };

  const x = d3.scaleLinear(
    [0, data.length - 1],
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
      if (data.length === 0) {
        return -1;
      }

      let max = data[0].value;
      let maxIndex = 0;

      for (let i = 1; i < data.length; i += 1) {
        if (data[i].value > max) {
          maxIndex = i;
          max = data[i].value;
        }
      }

      return maxIndex;
    }
    setLargest(indexOfMax());

    const svg = d3.select(windowRef.current);
    svg.select(".x-axis-top").remove();
    svg.select(".x-axis-bottom").remove();
    svg.select(".y-axis").remove();
    const xAxisLabelTop = d3
      .axisBottom(x)
      .ticks(data.length)
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(15)
      .tickFormat((d) => data[d.valueOf()].interval.split(" ")[0]);

    const xAxisLabelBottom = d3
      .axisBottom(x)
      .ticks(data.length)
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(15)
      .tickFormat((d) => data[d.valueOf()].interval.split(" ")[1]);

    const yAxisLabel = d3
      .axisLeft(y)
      .tickValues(
        d3.range(
          yAxis.min,
          yAxis.max + 0.0001,
          (yAxis.max - yAxis.min) / (yAxis.numDivisions - 1),
        ),
      )
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(15)
      .tickFormat(yAxisFormat);

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

    return () => window.removeEventListener("scroll", onScroll);
  }, [
    data,
    height,
    windowRef,
    x,
    y,
    yAxis.format,
    yAxis.max,
    yAxis.min,
    yAxis.numDivisions,
  ]);

  useEffect(() => {
    updateSize();
  }, [data]);

  const HoverableNode = ({ i, d }: { i: number; d: D3Data["data"][0] }) =>
    activeIndex === i && (
      <foreignObject
        x={x(i)}
        y={y(d.value) - 11 - barWidth / 2}
        width={barWidth}
        height="10"
        fontSize={8}
      >
        <div
          style={{
            textAlign: "center",
            color: "#A5A5A5",
            fontSize: 9,
          }}
        >
          {d.value}
        </div>
      </foreignObject>
    );

  return (
    <div
      className={styles.BarChart}
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
        <p className={styles.title}>{title}</p>
        {info !== "" && (
          <div
            className={styles.infoBox}
            onClick={() => {
              setInfoPopup(true);
            }}
            ref={infoButtonRef}
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
              actualChange !== null && actualChange < 0 ? "#EA4335" : "#05CD99",
          }}
        >
          {actualChange !== null &&
            percentageChange &&
            (actualChange < 0
              ? `⏷ \xa0 ${(actualChange * 100).toFixed(2)}%`
              : `⏶ \xa0 ${(actualChange * 100).toFixed(2)}%`)}
        </p>
      </div>
      <svg
        ref={windowRef}
        width={width}
        height={height}
        style={{ marginTop: 10 }}
        onMouseMove={hoverable ? handleMouseMove : undefined}
        onMouseLeave={hoverable ? handleMouseLeave : undefined}
      >
        <g fill="currentColor" stroke="currentColor" strokeWidth="1.5">
          {children ||
            data.map((d, i) => {
              const color =
                highlightLargest && largest === i ? "#FF9FB3" : "#008AFC";
              return (
                <Fragment key={i}>
                  <rect
                    x={x(i)}
                    y={y(d.value)}
                    width={barWidth}
                    height={height - y(d.value) - marginBottom}
                    color={color}
                    style={{ borderRadius: 10 }}
                  />
                  <circle
                    cx={x(i) + barWidth / 2}
                    cy={y(d.value)}
                    r={barWidth / 2}
                    color={color}
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
              );
            })}
          {data.map((d, i) => (
            <HoverableNode key={i} i={i} d={d} />
          ))}
        </g>
      </svg>
      <div style={{ justifyContent: "center" }}>
        <div>
          {/* <div
            style={{
              width: 18,
              height: 18,
              borderRadius: 50,
              backgroundColor: "#008AFC",
            }}
          /> */}
        </div>
      </div>
    </div>
  );
}
