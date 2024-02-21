import { CSSProperties } from "react";
import { CheckCircle as CC } from "@src/app/icons";
import styles from "./ActiveIndicatorBox.module.scss";

export default function ActiveIndicatorBox({
  active = true,
  style = {},
}: {
  active?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={styles.ActiveIndicatorBox} style={style}>
      <div className={styles.container}>
        <CC />
        <p className={styles.text}>{active ? "Active" : "Inactive"}</p>
      </div>
    </div>
  );
}
