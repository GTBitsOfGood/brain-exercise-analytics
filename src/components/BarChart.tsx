import { Poppins, Inter } from "next/font/google";
import * as d3 from "d3";
import {
  Fragment,
  MouseEvent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { D3Data } from "./types";

const inter700 = Inter({ subsets: ["latin"], weight: "700" });
const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const poppins600 = Poppins({ subsets: ["latin"], weight: "600" });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
interface DataParams extends D3Data {
  title: string;
  hoverable?: boolean;
  percentageChange?: boolean;
  highlightLargest?: boolean;
  children?: ReactNode;
}

export default function BarChart({
  title,
  data,
  width = 375,
  height = 180,
  style = {},
  yAxis = {
    min: 0,
    max: 1,
    numDivisions: 5,
    format: (d: d3.NumberValue) => JSON.stringify(d),
  },
  hoverable = false,
  percentageChange = false,
  highlightLargest = true,
  children,
}: DataParams) {
  const marginTop = 20;
  const marginRight = 25;
  const marginBottom = 25;
  const marginLeft = 35;
  const [largest, setLargest] = useState(-1);
  const barWidth = 20;
  const actualChange =
    data[0].value !== 0 ? data[data.length - 1].value / data[0].value - 1 : 1;
  const [activeIndex, setActiveIndex] = useState(-1);
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
      .attr("transform", `translate(${barWidth / 2}, ${height - marginBottom})`)
      .attr("class", "x-axis")
      .style("font", `9px ${poppins600.style.fontFamily}`)
      .style("color", "#B0BBD5")
      .call(xAxisLabel)
      .call((g) => g.select(".domain").remove());
    svg
      .append("g")
      .attr("transform", `translate(${marginLeft}, 0)`)
      .style("font", `9.5px ${poppins400.style.fontFamily}`)
      .style("color", "#A5A5A5")
      .call(yAxisLabel)
      .call((g) => g.select(".domain").remove());
  }, [windowRef]);

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
      style={{
        backgroundColor: "white",
        borderRadius: "15px",
        width: 430,
        height: 254,
        paddingTop: 18.6,
        paddingLeft: 16,
        paddingRight: 36,
        paddingBottom: 30,
        ...style,
      }}
    >
      <div
        className="titleBox"
        style={{ display: "flex", flexDirection: "row", margin: "auto" }}
      >
        <p
          style={{
            fontFamily: poppins500.style.fontFamily,
            color: "#A3AED0",
            fontSize: 12,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontFamily: inter700.style.fontFamily,
            color: actualChange < 0 ? "#EA4335" : "#05CD99",
            fontSize: 8.73,
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: 12,
          }}
        >
          {percentageChange &&
            (actualChange < 0
              ? `▾ \xa0 ${(actualChange * 100).toFixed(2)}%`
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
                    y={y(0)}
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
    </div>
  );
}
