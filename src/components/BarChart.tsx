import { Poppins } from "next/font/google";
import * as d3 from "d3";
import { Fragment, useEffect, useState } from "react";
import { D3Data } from "./types";

const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });
const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const poppins600 = Poppins({ subsets: ["latin"], weight: "600" });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
interface DataParams extends D3Data {
  highlightLargest?: boolean;
}

export default function BarChart({
  data,
  width = 375,
  height = 180,
  marginTop = 40,
  marginRight = 25,
  marginBottom = 25,
  marginLeft = 35,
  style = {},
  yAxis = {
    min: 0,
    max: 1,
    numDivisions: 5,
    format: (d: d3.NumberValue) => JSON.stringify(d),
  },
  highlightLargest = true,
}: DataParams) {
  const [largest, setLargest] = useState(-1);
  const barWidth = 20;
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

    const svg = d3.select("svg");

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
          yAxis.max + 1,
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
  }, []);

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
      <div className="titleBox">
        <p
          style={{
            fontFamily: poppins500.style.fontFamily,
            color: "#A3AED0",
            fontSize: 12,
          }}
        >
          Reading Volume Analysis
        </p>
      </div>
      <svg width={width} height={height} style={{ marginTop: 10 }}>
        <g fill="currentColor" stroke="currentColor" strokeWidth="1.5">
          {data.map((d, i) => {
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
                  width={barWidth}
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
        </g>
      </svg>
    </div>
  );
}
