import { Stack } from "@mui/material";
import { Poppins, Inter } from "next/font/google";
import { CSSProperties, ReactNode } from "react";

const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const inter700 = Inter({ subsets: ["latin"], weight: "700" });

interface DataParams {
  title: string;
  Icon: () => JSX.Element;
  text: string;
  titleAboveText?: boolean;
  Chip?: () => ReactNode;
  style?: CSSProperties;
}

export default function SmallDataBox({
  title,
  Icon,
  text,
  titleAboveText = false,
  style = {},
  Chip = () => <></>,
}: DataParams) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "15px",
        width: titleAboveText ? 192 : 245,
        height: titleAboveText ? 75 : 101,
        position: "relative",
        ...style,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: "14.5px",
          height: "100%",
          width: "100%",
          ...style,
        }}
      >
        {titleAboveText ? (
          <>
            <div
              className="Graphic"
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Icon />
              <Stack
                direction="column"
                textAlign={"left"}
                sx={{ marginLeft: "10px" }}
              >
                <div className="titleBox">
                  <p
                    style={{
                      fontFamily: poppins500.style.fontFamily,
                      fontSize: 12,
                      lineHeight: "20px",
                      letterSpacing: "-0.02em",
                      textAlign: "left",
                      color: "#A3AED0",
                    }}
                  >
                    {title}
                  </p>
                </div>
                <p
                  style={{
                    font: inter700.style.fontFamily,
                    fontWeight: 700,
                    fontSize: "18px",
                    lineHeight: "27px",
                    letterSpacing: "-0.02em",
                    textAlign: "left",
                    marginTop: "auto",
                    marginBottom: "auto",
                    color: "#2B3674",
                  }}
                >
                  {text}
                </p>
              </Stack>
            </div>
          </>
        ) : (
          <>
            <div
              className="titleBox"
              style={{
                marginLeft: titleAboveText ? 50 : 5,
                marginBottom: titleAboveText ? -10 : 0,
              }}
            >
              <p
                style={{
                  fontFamily: poppins500.style.fontFamily,
                  fontSize: 12,
                  lineHeight: "20px",
                  letterSpacing: "-0.02em",
                  textAlign: "left",
                  color: "#A3AED0",
                }}
              >
                {title}
              </p>
            </div>
            <div
              className="Graphic"
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Icon />
              <p
                style={{
                  font: inter700.style.fontFamily,
                  fontWeight: 700,
                  fontSize: "18px",
                  lineHeight: "27px",
                  letterSpacing: "-0.02em",
                  textAlign: "left",
                  marginTop: "auto",
                  marginBottom: "auto",
                  marginLeft: 10,
                  color: "#2B3674",
                }}
              >
                {text}
              </p>
            </div>
          </>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "5px",
          right: "20px",
        }}
      >
        <Chip />
      </div>
    </div>
  );
}
