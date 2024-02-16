import React from "react";

const Modal = ({ closeModal }) => {
  return (
    <div>
      <div>
        <span onClick={closeModal}>&times;</span>
        <h1>Testing my modal</h1>
      </div>
    </div>
  );
};

export default Modal;
