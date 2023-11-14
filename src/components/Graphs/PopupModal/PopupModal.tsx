import React from "react";
import styles from "./PopupModal.module.css";

interface InputProp {
  show: boolean;
  info: string;
  style?: object;
}

const PopupModal = ({ show, info, style = {} }: InputProp) => {
  if (!show) {
    return null;
  }
  return (
    <div className={styles.modal} style={style}>
      {info}
    </div>
  );
};

export default PopupModal;
