import { CSSProperties } from "react";
import { classes } from "@src/utils/utils";
import styles from "./OperationSuccessModal.module.css";
import CheckCircle from "@src/app/icons/CheckCircle";

interface Props {
  className?: string;
  style?: CSSProperties;
  showModal: boolean;
  setShowModal: (newShowModal: boolean) => void;
  subtitle?: string;
  title?: string;
  description?: string;
}

const Modal = ({ className, style, showModal, setShowModal, subtitle, title, description}: Props) => {

  return (
    <div className={classes(styles.container, className)} style={style}>
      <CheckCircle className={styles.checkCircle}></CheckCircle>
      <div className={styles.mediumText}>{subtitle}</div>
      <div className={styles.bigText}>{title}</div>
      <div className={styles.smallText}>{description}</div>
    </div>
  );
};

export default Modal;
