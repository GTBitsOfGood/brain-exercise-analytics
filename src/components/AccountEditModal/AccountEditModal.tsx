import React from "react";
import styles from "./AccountEditModal.module.css";
const Modal = ({ closeModal }) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div>Profile</div>
        <div>Password</div>
        <div>Sign Out</div>
      </div>
      <div>
        <span onClick={closeModal}>&times;</span>
        <h1>Testing my modal</h1>
      </div>
    </div>
  );
};

export default Modal;
