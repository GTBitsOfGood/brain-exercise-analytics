import React from "react";
import styles from "./AccountEditModal.module.css";
const Modal = ({ closeModal }) => {
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.profile}>Profile</div>
        <div className={styles.password}>Password</div>
        <div className={styles.signout}>Sign Out</div>
      </div>
      <div className={styles.vl}></div>
      <div className={styles.info}>
        {/* <span onClick={closeModal}>&times;</span> */}
        <div className={styles.header}>
          <img
            src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/141.jpg"
            alt="Description of the image"
          />
          <div className={styles.myContainer}>
            <div className={styles.first}>
              <div>userName</div>
              <div>status</div>
            </div>
          </div>
        </div>
        <div className={styles.inputs}>
          <div className={styles.inputField}>
            <label>Name:</label>
            <input placeholder="      First Name Last Name" name="myInput" />
          </div>

          <div className={styles.inputField}>
            <label>Date of Birth:</label>
            <input placeholder="      MM/DD/YY" name="myInput" />
          </div>

          <div className={styles.inputField}>
            <label>Phone:</label>
            <input placeholder="      (xxx) xxx-xxxx" name="myInput" />
          </div>

          <div className={styles.inputField}>
            <label>Email:</label>
            <input placeholder="      Email" name="myInput" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
