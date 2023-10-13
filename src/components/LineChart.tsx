import { Poppins, Inter } from "next/font/google";
import * as d3 from "d3";
import { Fragment, MouseEvent, useState } from "react";

interface D3Data {
  data: [number, number][];
  width?: number;
  height?: number;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
  style?: object;
}

const inter700 = Inter({ subsets: ["latin"], weight: "700" });
const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const poppins600 = Poppins({ subsets: ["latin"], weight: "600" });

const samplePerc = -2.45;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call

export default function LineChart({
  data,
  width = 410,
  height = 174,
  marginTop = 20,
  marginRight = 20,
  marginBottom = 40,
  marginLeft = 40,
  style = {},
}: D3Data) {
  const [activeIndex, setActiveIndex] = useState(-1);
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

  const svg = d3.select("svg");

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight],
  );
  const xAxis = d3
    .axisBottom(x)
    .ticks(5)
    .tickSizeOuter(0)
    .tickSizeInner(0)
    .tickPadding(15);
  // xAxis.tickFormat(data).tickFont("12px sans-serif");
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  const y = d3.scaleLinear([0, 1], [height - marginBottom, marginTop]);
  const yAxis = d3
    .axisLeft(y)
    .tickValues([0, 0.25, 0.5, 0.75, 1])
    .tickSizeOuter(0)
    .tickSizeInner(0)
    .tickPadding(15)
    .tickFormat(d3.format(".0%"));
  const line = d3
    .line()
    .x((d) => x(d[0]))
    .y((d) => y(d[1]))
    .curve(d3.curveCatmullRom);

  svg
    .append("g")
    .attr("transform", `translate(0, ${height - marginBottom})`)
    .attr("class", "x-axis")
    .style("font", `9px ${poppins600.style.fontFamily}`)
    // .style("margin-left", "20px")
    .style("color", "#B0BBD5")
    .call(xAxis)
    .call((g) => g.select(".domain").remove());
  svg
    .append("g")
    .attr("transform", `translate(${marginLeft}, 0)`)
    .style("font", `9.5px ${poppins400.style.fontFamily}`)
    .style("color", "#A5A5A5")
    .call(yAxis)
    .call((g) => g.select(".domain").remove());

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
    >
      <div className="titleBox">
        <p
          style={{
            fontFamily: poppins500.style.fontFamily,
            color: "#A3AED0",
            fontSize: 12,
          }}
        >
          Accuracy
        </p>
        <p
          style={{
            fontFamily: inter700.style.fontFamily,
            color: samplePerc < 0 ? "#EA4335" : "#05CD99",
            fontSize: 8.73,
            marginTop: 11,
          }}
        >
          {samplePerc < 0 ? `▾ \xa0 ${samplePerc}` : `⏶ \xa0 ${samplePerc}`}
        </p>
        <p
          style={{
            fontFamily: poppins500.style.fontFamily,
            color: "#BDCDFF",
            fontSize: 10.2,
          }}
        >
          Improved...
        </p>
      </div>
      <svg
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ marginTop: 10 }}
      >
        <path
          fill="none"
          stroke="#008AFC"
          strokeWidth="6"
          d={line(data) as string | undefined}
          radius={"10px"}
        />
        <g fill="white" stroke="currentColor" strokeWidth="1.5">
          <circle
            key={-1}
            cx={x(data[0][0])}
            cy={y(data[0][1])}
            r="2.5"
            strokeWidth={1}
            color="#008AFC"
            fill="#008AFC"
          />
          <circle
            key={-2}
            cx={x(data[data.length - 1][0])}
            cy={y(data[data.length - 1][1])}
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
                    cx={x(d[0])}
                    cy={y(d[1])}
                    r="7.5"
                    strokeWidth={5}
                    color="#008AFC"
                  ></circle>
                  <foreignObject
                    x={x(d[0])}
                    y={y(d[1] + 0.2)}
                    width="30"
                    height="30"
                    fontSize={8}
                  >
                    <div style={{ color: "#A5A5A5" }}>
                      {Math.round(d[1] * 100) / 100}
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