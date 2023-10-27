import { Poppins, Inter } from "next/font/google";
import { CSSProperties, HTMLAttributes } from "react";

const poppins500 = Poppins({ subsets: ["latin"], weight: "500" });
const inter700 = Inter({ subsets: ["latin"], weight: "700" });

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
interface DataParams {
  title: string;
  Icon: () => JSX.Element;
  text: string;
  titleAboveText?: boolean;
  style?: CSSProperties;
}

export default function SmallDataBox({
  title,
  Icon,
  text,
  titleAboveText = false,
  style = {},
}: DataParams) {
  return (
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "15px",
        width: titleAboveText ? 192 : 245,
        height: titleAboveText ? 75 : 101,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        ...style,
      }}
    >
      <div
        className="titleBox"
        style={{
          marginLeft: titleAboveText ? 65 : 20,
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
          marginLeft: 14.5,
          display: "flex",
          flexDirection: "row",
        }}
      >
        <Icon />
        <p
          style={{
            font: inter700.style.fontFamily,
            fontWeight: 700,
            fontSize: 20,
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
    </div>
  );
}
