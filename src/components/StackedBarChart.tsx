import * as d3 from "d3";
import { Fragment } from "react";
import { StackedDataRecord } from "@/common_utils/types";
import { D3Data } from "./types";
import BarChart from "./BarChart";

interface DataParams extends D3Data {
  data: StackedDataRecord[];
  title: string;
  hoverable?: boolean;
  percentageChange?: boolean;
}

export default function StackedBarChart({
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
}: DataParams) {
  const marginTop = 20;
  const marginRight = 25;
  const marginBottom = 25;
  const marginLeft = 35;
  const barWidth = 20;
  const x = d3.scaleLinear(
    [0, data.length - 1],
    [marginLeft, width - marginRight],
  );
  const y = d3.scaleLinear(
    [yAxis.min, yAxis.max],
    [height - marginBottom, marginTop],
  );
  return (
    <BarChart
      title={title}
      data={data}
      width={width}
      height={height}
      style={style}
      yAxis={yAxis}
      hoverable={hoverable}
      percentageChange={percentageChange}
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
            color="white"
            style={{ borderRadius: 10 }}
          />
        </Fragment>
      ))}
    </BarChart>
  );
}