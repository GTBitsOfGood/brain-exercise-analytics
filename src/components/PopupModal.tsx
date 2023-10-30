import React from "react";

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
    <div
      style={{
        zIndex: 500,
        backgroundColor: "#CDCDCD",
        width: 300,
        borderRadius: 10,
        padding: 10,
        border: "0.8px solid black",
        ...style,
      }}
    >
      {info}
    </div>
  );
};

export default PopupModal;
