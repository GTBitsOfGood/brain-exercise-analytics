import React from "react";
import { Poppins } from "next/font/google";
import { classes } from "@src/utils/utils";
import styles from "./BooleanBox.module.css";

const poppins = Poppins({
  subsets: ["latin-ext"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface InputPropType {
  className?: string;
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
  className,
  title,
  greenText,
  redText,
  Icon,
  showGreen,
  height,
  width,
  style = {},
}: InputPropType) => {
  return (
    <div
      className={classes(styles.body, poppins.variable, className)}
      style={{
        height,
        width,
        ...style,
      }}
    >
      <div className={styles.iconHeader}>
        <Icon />
        {title}
      </div>
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
