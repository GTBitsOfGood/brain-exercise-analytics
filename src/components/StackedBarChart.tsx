import * as d3 from "d3";
import { Fragment } from "react";
import { D3Data } from "./types";
import BarChart from "./BarChart";

interface DataParams extends D3Data {
  data: {
    interval: string;
    value: number;
    stackedValue: number;
  }[];
}

export default function StackedBarChart({
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
}: DataParams) {
  const barWidth = 20;
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight]
  );
  const y = d3.scaleLinear(
    [yAxis.min, yAxis.max],
    [height - marginBottom, marginTop]
  );
  return (
    <BarChart
      data={data}
      width={width}
      height={height}
      marginBottom={marginBottom}
      marginTop={marginTop}
      marginLeft={marginLeft}
      marginRight={marginRight}
      style={style}
      yAxis={yAxis}
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
            y={y(0)}
            width={barWidth}
            height={barWidth / 2}
            color='white'
            style={{ borderRadius: 10 }}
          />
        </Fragment>
      ))}
    </BarChart>
  );
}
