import React from "react";
import { Poppins } from "next/font/google";
import styles from "./BooleanBox.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface InputPropType {
  title: string;
  greenText: string;
  redText: string;
  showGreen: boolean;
  Icon: () => JSX.Element;
  height?: number;
  width?: number;
  style?: object;
}

const BooleanBox = ({
  title,
  greenText,
  redText,
  Icon,
  showGreen,
  height = 101,
  width = 421,
  style = {},
}: InputPropType) => {
  return (
    <div
      className={[styles.body, poppins.variable].join(" ")}
      style={{
        height,
        width,
        marginTop: "16px",
        ...style,
      }}
    >
      <Icon />
      {title}
      {showGreen && (
        <div className={styles.infoBox} style={{ backgroundColor: "#70E975" }}>
          {greenText}
        </div>
      )}
      {!showGreen && (
        <div className={styles.infoBox} style={{ backgroundColor: "#FF8B71" }}>
          {redText}
        </div>
      )}
    </div>
  );
};

export default BooleanBox;
