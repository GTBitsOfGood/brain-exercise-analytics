import { CSSProperties } from "react";
import { LoadingIcon } from "@src/app/icons";
import { classes } from "@src/utils/utils";

import styles from "./LoadingBox.module.scss";

interface Props {
  className?: string;
  style?: CSSProperties;
}

export default function LoadingBox({ className, style }: Props) {
  return (
    <div className={classes(styles.container, className)} style={style}>
      <div className={styles.box}>
        <LoadingIcon className={styles.icon} />
        <h1>Loading...</h1>
      </div>
    </div>
  );
}
