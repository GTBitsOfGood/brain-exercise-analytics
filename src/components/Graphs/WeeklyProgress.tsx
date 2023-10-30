import { /* Poppins, Inter, */ DM_Sans } from "next/font/google";
import { CSSProperties } from "react";
import { Days } from "@/common_utils/types";
import { Box, Stack, Typography } from "@mui/material";
import { grayCircle as GC, checkMark as CM } from "@src/app/icons";

// const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
// const inter700 = Inter({ subsets: ["latin"], weight: "700" });
const dmSans700 = DM_Sans({ subsets: ["latin"], weight: "700" });

interface DataParams {
  days: Days[];
  style?: CSSProperties;
}
const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Current paramters do not provide this. We need to change the parameter signature
const week = ["17/9", "18/9", "19/9", "20/9", "21/9", "22/9", "23/9"];

export default function WeeklyProgress({ days, style = {} }: DataParams) {
  return (
    <Box
      sx={{
        width: "100%",
        height: "170px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        padding: "0px 21px",
        ...style,
      }}
    >
      <Typography
        sx={{
          marginTop: "20px",
          fontSize: "14px",
          fontFamily: dmSans700.style.fontFamily,
          lineHeight: "22px",
          color: "#A3AED0",
        }}
      >
        Weekly Progress
      </Typography>
      <Box
        sx={{
          width: "97%",
          height: "16px",
          margin: "22px 5px 0px",
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "16px",
            alignItems: "flex-start",
            backgroundColor: "#f3f3f3",
            position: "absolute",
            marginTop: "12.5px",
          }}
        />
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            textAlign: "center",
            position: "absolute",
          }}
        >
          {[...Array<number>(7)].map((_, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                width: "41px",
                flexDirection: "column",
                textAlign: "center",
              }}
            >
              <Box
                sx={{
                  height: "41px",
                  width: "41px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    width: "41px",
                    height: "41px",
                  }}
                >
                  <GC />
                </Box>
                {((i === 0 && days.includes(Days.Sunday)) ||
                  (i === 1 && days.includes(Days.Monday)) ||
                  (i === 2 && days.includes(Days.Tuesday)) ||
                  (i === 3 && days.includes(Days.Wednesday)) ||
                  (i === 4 && days.includes(Days.Thursday)) ||
                  (i === 5 && days.includes(Days.Friday)) ||
                  (i === 6 && days.includes(Days.Saturday))) && (
                  <Box
                    sx={{
                      position: "relative",
                      borderRadius: "50%",
                      width: "27px",
                      height: "27px",
                      backgroundColor: "#008AFC",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      zIndex: 3,
                    }}
                  >
                    <CM />
                  </Box>
                )}
              </Box>
              <Stack
                direction="column"
                sx={{ marginTop: "7px" }}
                spacing={"7px"}
                justifyContent={"center"}
                alignContent={"center"}
              >
                <Typography
                  sx={{
                    fontFamily: dmSans700.style.fontFamily,
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "-0.02em",
                    textAlign: "center",
                    color: "#A3AED0",
                  }}
                >
                  {weekDays[i]}
                </Typography>
                <Typography
                  sx={{
                    marginTop: "14px",
                    fontFamily: dmSans700.style.fontFamily,
                    fontSize: "14px",
                    lineHeight: "18px",
                    letterSpacing: "-0.02em",
                    textAlign: "center",
                  }}
                >
                  {week[i]}
                </Typography>
              </Stack>
              {((i === 0 &&
                days.includes(Days.Sunday) &&
                days.includes(Days.Monday)) ||
                (i === 1 &&
                  days.includes(Days.Monday) &&
                  days.includes(Days.Tuesday)) ||
                (i === 2 &&
                  days.includes(Days.Tuesday) &&
                  days.includes(Days.Wednesday)) ||
                (i === 3 &&
                  days.includes(Days.Wednesday) &&
                  days.includes(Days.Thursday)) ||
                (i === 4 &&
                  days.includes(Days.Thursday) &&
                  days.includes(Days.Friday)) ||
                (i === 5 &&
                  days.includes(Days.Friday) &&
                  days.includes(Days.Saturday))) && (
                <Box
                  sx={{
                    width: "16.5%",
                    marginLeft: "1.5%",
                    height: "9px",
                    marginTop: "16px",
                    backgroundColor: "#008AFC",
                    position: "absolute",
                    zIndex: 2,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
