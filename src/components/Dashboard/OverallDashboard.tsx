/* eslint-disable prettier/prettier */
import { Box, Typography, Stack } from "@mui/material";
import { Select } from "@mui/base/Select";
import { Option } from "@mui/base/Option";
import { SelectOption } from "@mui/base/useOption";
import { DM_Sans, Poppins } from "next/font/google";
import {
  dashboardIcon as DB,
  importantGrayIcon as IGI,
  checkCircle as CC,
  calendarIcon as CI,
  arrowDown as AD,
} from "@src/app/icons";
import { CSSProperties, useState } from "react";
import { Days } from "@/common_utils/types";
import WeeklyProgress from "../Graphs/WeeklyProgress";

interface Params {
  streak: Days[];
  style?: CSSProperties;
}
// For the name of the user it would be really useful to have a reducer store this information globally during authentication (like in the mobile app)
const currentUser = "John Doe";

const dmSans700 = DM_Sans({ subsets: ["latin"], weight: "700" });
const poppins400 = Poppins({ subsets: ["latin"], weight: "400" });

function ActiveIndicator({
  active = true,
  style = {},
}: {
  active?: boolean;
  style?: CSSProperties;
}) {
  return (
    <Box
      sx={{
        width: "95.232px",
        height: "41.937px",
        borderRadius: "13.105px",
        backgroundColor: "rgba(5, 205, 153, 0.10)",
        paddingTop: "10.48px",
        paddingBottom: "10.48px",
        paddingLeft: "12px",
        ...style,
      }}
    >
      <Stack direction='row' alignItems='center' spacing={"4px"}>
        <CC />
        <Typography
          sx={{
            color: "#2B3674",
            fontFamily: dmSans700.style.fontFamily,
            fontSize: "12.232px",
            fontStyle: "normal",
            lineHeight: "20.968px",
            letterSpacing: "-0.245px",
          }}
        >
          {active ? "Active" : "Inactive"}
        </Typography>
      </Stack>
    </Box>
  );
}
function Dropdown({ style = {} }: { active?: boolean; style?: CSSProperties }) {
  const [age, setAge] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const handleChange = (_: unknown, newValue: number | null) => {
    setAge(newValue);
    console.log(newValue);
  };
  return (
    <Box
      sx={{
        ...style,
      }}
    >
      <Select
        value={age}
        style={{
          width: "154px",
          height: "33px",
          flexShrink: 0,
          backgroundColor: "white",
          border: 0,
          borderRadius: 4,
          paddingLeft: "13px",
          paddingRight: "6px",
          paddingTop: "auto",
          paddingBottom: "auto",
        }}
        onChange={handleChange}
        renderValue={(option: SelectOption<number> | null) => {
          return (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: "100%",
              }}
            >
              <CI />
              <Typography
                sx={{
                  color: "#8D8D8D",
                  fontFamily: poppins400.style.fontFamily,
                  fontSize: "14px",
                  lineHeight: "18px",
                  letterSpacing: "0.42px",
                  marginLeft: "16px",
                  marginRight: "auto",
                }}
              >
                {option ? option.label : "Select"}
              </Typography>
              <AD />
            </Box>
          );
        }}
      >
        <Box
          style={{
            height: "2px",
          }}
        />
        {["Most Recent", "3 Months", "6 Months", "12 Months", "Max"].map(
          (label, i) => (
            <Option
              key={i}
              value={i}
              style={{
                display: "flex",
                width: "153px",
                height: "46px",
                padding: "11px 24px",
                justifyContent: "space-between",
                alignItems: "center",
                flexShrink: 0,
                alignSelf: "stretch",
                borderRadius: (() => {
                  if (i === 0) return "3px 3px 0px 0px";
                  if (i === 4) return "0px 0px 3px 3px";
                  return "0px 0px 0px 0px";
                })(),
                backgroundColor: hover === i ? "#DDEBFF" : "white",
                boxShadow:
                  "12.02189px 14.59801px 34.34826px 3.43483px rgba(112, 144, 176, 0.08)",
              }}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
            >
              {label}
            </Option>
          )
        )}
        <Box
          style={{
            height: "2px",
          }}
        />
      </Select>
    </Box>
  );
}

export default function OverallDashboard(params: Params) {
  return (
    <Box
      sx={{
        height: 564,
        width: "100%",
        ...params.style,
      }}
    >
      <Stack
        direction='row'
        alignItems='center'
        justifyContent='flex-start'
        marginBottom='51px'
      >
        <DB />
        <Typography
          sx={{
            color: "#2B3674",
            fontFamily: dmSans700.style.fontFamily,
            fontSize: "29.705px",
            fontStyle: "normal",
            lineHeight: "36.695px",
            letterSpacing: "-0.594px",
            marginLeft: "20px",
          }}
        >
          Overall Dashboard
        </Typography>
        <Typography
          sx={{
            color: "#A3AED0",
            fontFamily: dmSans700.style.fontFamily,
            fontSize: "29.705px",
            fontStyle: "normal",
            lineHeight: "36.695px",
            letterSpacing: "-0.594px",
            marginLeft: "62px",
          }}
        >
          {currentUser}
        </Typography>
        <ActiveIndicator
          active
          style={{ marginLeft: "17px", marginRight: "10px" }}
        />
        <IGI />
        <Dropdown style={{ marginLeft: "auto" }} />
      </Stack>
      <WeeklyProgress days={params.streak} />
    </Box>
  );
}
