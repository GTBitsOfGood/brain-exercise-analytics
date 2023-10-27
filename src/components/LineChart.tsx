import { Poppins, Inter } from "next/font/google";
import * as d3 from "d3";
import { Fragment, MouseEvent, useEffect, useRef, useState } from "react";
import { InfoIcon } from "@src/app/icons/InfoIcon";
import PopupModal from "./PopulModal/PopupModal";
import { D3Data } from "./types";

const inter700 = Inter({ subsets: ["latin"], weight: "700" });
const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const poppins600 = Poppins({ subsets: ["latin"], weight: "600" });

interface DataParams extends D3Data {
  title: string;
  hoverable?: boolean;
  percentageChange?: boolean;
  gradient?: boolean;
  info?: string;
}

export default function LineChart({
  data,
  width = 410,
  height = 174,
  style = {},
  yAxis = {
    min: d3.min(data.map((v) => v.value)) ?? 0,
    max: d3.max(data.map((v) => v.value)) ?? 1,
    numDivisions: 5,
    format: (d: d3.NumberValue) => JSON.stringify(d),
  },
  title,
  hoverable = false,
  percentageChange = false,
  gradient = false,
  info = "",
}: DataParams) {
  const infoButtonRef = useRef(null);
  const marginTop = 20;
  const marginRight = 20;
  const marginBottom = 40;
  const marginLeft = 40;
  const [activeIndex, setActiveIndex] = useState(-1);
  const [infoPopup, setInfoPopup] = useState(false);

  const actualChange =
    data.length < 2
      ? null
      : data[data.length - 1].value / data[data.length - 2].value - 1;

  function handleMouseMove(e: MouseEvent) {
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

  const windowRef = useRef(null);

  const y = d3.scaleLinear(
    [yAxis.min, yAxis.max],
    [height - marginBottom, marginTop],
  );

  const x = d3.scaleLinear(
    [0, data.length - 1],
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
    const svg = d3.select(windowRef.current);
    svg.select(".x-axis").remove();
    svg.select(".y-axis").remove();
    const xAxisLabel = d3
      .axisBottom(x)
      .ticks(data.length)
      .tickSizeOuter(0)
      .tickSizeInner(0)
      .tickPadding(15)
      .tickFormat((d) => data[d.valueOf()].interval);
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
      .attr("transform", `translate(0, ${height - marginBottom})`)
      .attr("class", "x-axis")
      .style("font", `9px ${poppins600.style.fontFamily}`)
      .style("color", "#B0BBD5")
      .call(xAxisLabel)
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
    x,
    y,
    yAxis.format,
    yAxis.max,
    yAxis.min,
    yAxis.numDivisions,
  ]);

  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "15px",
        width: 465,
        height: 280,
        paddingTop: 18.6,
        paddingLeft: 18,
        paddingRight: 36,
        paddingBottom: 38,
        ...style,
      }}
      onClick={() => {
        if (infoPopup) {
          setInfoPopup(false);
        }
      }}
    >
      <div className="titleBox" style={{ display: "inline-flex" }}>
        <p
          style={{
            fontFamily: poppins500.style.fontFamily,
            color: "#A3AED0",
            fontSize: 12,
          }}
        >
          {title}
        </p>
        {info !== "" && (
          <div
            style={{
              fontSize: 12,
              marginTop: "auto",
              marginBottom: "auto",
              marginLeft: 12,
              cursor: "pointer",
            }}
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
                top: `${
                  infoButtonRef.current != null
                    ? infoButtonRef.current.getBoundingClientRect().y - 50
                    : 0
                }px`,
                zIndex: 500,
                left: `${
                  infoButtonRef.current != null
                    ? infoButtonRef.current.getBoundingClientRect().x
                    : 0
                }px`,
              }}
            />
          </div>
        )}
        <p
          style={{
            fontFamily: inter700.style.fontFamily,
            color:
              actualChange !== null && actualChange < 0 ? "#EA4335" : "#05CD99",
            fontSize: 8.73,
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: 12,
          }}
        >
          {actualChange !== null &&
            percentageChange &&
            (actualChange < 0
              ? `⏷ \xa0 ${(actualChange * 100).toFixed(2)}%`
              : `⏶ \xa0 ${(actualChange * 100).toFixed(2)}%`)}
        </p>
        <p
          style={{
            fontFamily: poppins500.style.fontFamily,
            color: "#BDCDFF",
            fontSize: 10.2,
          }}
        >
          {actualChange !== null && percentageChange}
        </p>
      </div>
      <svg
        ref={windowRef}
        width={width}
        height={height}
        onMouseMove={hoverable ? handleMouseMove : undefined}
        onMouseLeave={hoverable ? handleMouseLeave : undefined}
        style={{ marginTop: 10 }}
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
          fill="none"
          stroke="#008AFC"
          strokeWidth="6"
          d={line(data.map((d, i) => [i, d.value])) as string | undefined}
          radius={"10px"}
          height={"100%"}
          filter="url(#drop-shadow)"
        />
        <g fill="white" stroke="currentColor" strokeWidth="1.5">
          <circle
            key={-1}
            cx={x(0)}
            cy={y(data[0].value)}
            r="2.5"
            strokeWidth={1}
            color="#008AFC"
            fill="#008AFC"
          />
          <circle
            key={-2}
            cx={x(data.length - 1)}
            cy={y(data[data.length - 1].value)}
            r="2.5"
            strokeWidth={1}
            color="#008AFC"
            fill="#008AFC"
          />
          {data.map(
            (d, i) =>
              activeIndex === i && (
                <Fragment key={i}>
                  <circle
                    cx={x(i)}
                    cy={y(d.value)}
                    r="7.5"
                    strokeWidth={5}
                    color="#008AFC"
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
