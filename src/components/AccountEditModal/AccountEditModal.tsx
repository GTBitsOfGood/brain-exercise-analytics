import styles from "./AccountEditModal.module.css";
import StatusBadge from "../StatusBadge/StatusBadge";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import { RootState } from "@src/redux/rootReducer";
import { update } from "../../redux/reducers/authReducer/index";
import { useEffect } from "react";

const Modal = ({ closeModal }) => {
  const dispatch = useDispatch();

  const [isOnline, setIsOnline] = useState(false);
  const { name, phoneNumber, email } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    dispatch(update({ email: "cc@example.com" }));
  }, [dispatch]);
  useEffect(() => {
    // This will log the updated email value after the dispatch
    console.log("after is " + email);
  }, [email]); // Log the email whenever it changes
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.profile}>Profile</div>
        <p>Name: {name}</p>
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
              <label>User Name</label>
              <StatusBadge isOnline={isOnline} />
            </div>
            <div className={styles.second}>
              <div>
                <div>BEI Chapter Name</div>
                <div>Position or Title</div>
              </div>
              <button className={styles.editButton}>Edit Profile</button>
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
