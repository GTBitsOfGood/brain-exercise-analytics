import { CSSProperties, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./ActiveIndicatorBox.module.scss";

export default function ActiveIndicatorBox({
  active = true,
  style = {},
}: {
  active?: boolean;
  style?: CSSProperties;
}) {
  const { text, backgroundColor, Icon } = useMemo(() => {
    if (active) {
      return {
        text: "Active",
        backgroundColor: "#D6F6EA",
        Icon: <FontAwesomeIcon icon={faCircleCheck} color="#05cd99" />,
      };
    }
    return {
      text: "Inactive",
      backgroundColor: "#FCDCE2",
      Icon: <FontAwesomeIcon icon={faCircleXmark} color="#ff004c" />,
    };
  }, [active]);

  return (
    <div
      className={styles.ActiveIndicatorBox}
      style={{ ...style, backgroundColor }}
    >
      <div className={styles.container}>
        {Icon}
        <p className={styles.text}>{text}</p>
      </div>
    </div>
  );
}
