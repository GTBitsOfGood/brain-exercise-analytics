import { CSSProperties } from "react";
import { classes } from "@src/utils/utils";

import styles from "./Modal.module.scss";

interface Props {
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
  disableBackgroundClick?: boolean;
  className?: string;
  style?: CSSProperties;
  children: React.ReactElement;
}

export default function Modal({
  showModal,
  setShowModal,
  disableBackgroundClick,
  className,
  style,
  children,
}: Props) {
  if (!showModal) {
    return null;
  }
  return (
    <div className={classes(styles.modal, className)} style={style}>
      <div
        className={styles.modalBackground}
        {...(disableBackgroundClick
          ? {}
          : { onClick: () => setShowModal(false) })}
      />
      {children}
    </div>
  );
}
