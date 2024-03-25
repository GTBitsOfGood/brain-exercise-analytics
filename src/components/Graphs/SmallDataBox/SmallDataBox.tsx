import { classes } from "@src/utils/utils";
import { Poppins, Inter } from "next/font/google";
import { CSSProperties, ReactNode } from "react";
import styles from "./SmallDataBox.module.scss";

const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const inter600 = Inter({ subsets: ["latin"], weight: "600" });

interface DataParams {
  className?: string;
  title: string;
  Icon: ({
    className,
    isActive,
  }: {
    className?: string;
    isActive?: boolean;
  }) => JSX.Element;
  text: string;
  Chip?: () => ReactNode;
  style?: CSSProperties;
  [prop: string]: unknown;
}

export default function SmallDataBox({
  className,
  title,
  Icon,
  text,
  style = {},
  Chip = () => <></>,
  ...props
}: DataParams) {
  return (
    <div
      className={classes(styles.container, className)}
      style={style}
      {...props}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "0 14.5px",
          height: "100%",
          width: "100%",
          ...style,
        }}
      >
        <div
          className="Graphic"
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "51px",
              height: "51px",
              backgroundColor: "#F4F7FE",
              borderRadius: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              textAlign: "left",
              marginLeft: "10px",
            }}
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
                font: inter600.style.fontFamily,
                fontWeight: 600,
                fontSize: "16px",
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
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "12px",
          right: "20px",
        }}
      >
        <Chip />
      </div>
    </div>
  );
}
