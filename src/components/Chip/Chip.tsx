import { CSSProperties, ReactNode } from "react";
import { classes } from "@src/utils/utils";
import styles from "./Chip.module.scss";

export default function Chip(props: {
  className?: string;
  color: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={classes(styles.Chip, props.className)}
      style={{
        backgroundColor: props.color,
        ...props.style,
      }}
    >
      <p className={styles.text}>{props.children}</p>
    </div>
  );
}
