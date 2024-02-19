import styles from "./AccountEditModal.module.css";
import StatusBadge from "../StatusBadge/StatusBadge";
import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import { RootState } from "@src/redux/rootReducer";
import { update } from "../../redux/reducers/authReducer/index";
import { useEffect } from "react";

const Modal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const {
    name,
    phoneNumber,
    email,
    patientDetails: { birthDate },
    adminDetails: { active },
  } = useSelector((state: RootState) => state.auth);
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState(phoneNumber);
  const [updatedEmail, setUpdatedEmail] = useState(email);
  const [updatedBirthDate, setUpdatedBirthDate] = useState(birthDate);

  useEffect(() => {
    console.log(name + phoneNumber + email + birthDate);
  }, [name, phoneNumber, email]);

  const handleUpdateUserInfo = () => {
    dispatch(
      update({
        name: updatedName,
        phoneNumber: updatedPhoneNumber,
        email: updatedEmail,
        patientDetails: {
          birthDate: updatedBirthDate,
        },
      })
    );
  };
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
              <label>{name}</label>
              <StatusBadge isOnline={active} />
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
            <input
              placeholder="First Name Last Name"
              value={updatedName}
              onChange={(e) => setUpdatedName(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label>Date of Birth:</label>
            <input
              placeholder="MM/DD/YY"
              value={updatedBirthDate}
              onChange={(e) => setUpdatedBirthDate(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label>Phone:</label>
            <input
              placeholder="(123) 456-7890"
              value={updatedPhoneNumber}
              onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
            />
          </div>

          <div className={styles.inputField}>
            <label>Email:</label>
            <input
              placeholder="blankemail@gmail"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
            />
          </div>
          <button onClick={handleUpdateUserInfo}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
