import React from "react";
import styles from "./PopupModal.module.css";

const PopupModal = (props: { show: boolean; info: string }) => {
  if (!props.show) {
    return null;
  }
  return <div style={{ zIndex: 500, position: "absolute" }}>{props.info}</div>;
};

export default PopupModal;
