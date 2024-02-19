import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import { RootState } from "@src/redux/rootReducer";
import { update, logout } from "../../redux/reducers/authReducer/index";
import StatusBadge from "../StatusBadge/StatusBadge";
import styles from "./AccountEditModal.module.css";

interface DataParams {
  closeModal: () => void;
}
const Modal = (params: DataParams) => {
  const [edit, setEdit] = useState(false);
  const dispatch = useDispatch();
  const {
    name,
    phoneNumber,
    email,
    patientDetails,
    adminDetails: { active },
  } = useSelector((state: RootState) => state.auth);
  const { birthDate } = patientDetails;
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState(phoneNumber);
  const [updatedEmail, setUpdatedEmail] = useState(email);
  const [updatedBirthDate, setUpdatedBirthDate] = useState(birthDate);

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSaveChanges = () => {
    dispatch(
      update({
        name: updatedName,
        phoneNumber: updatedPhoneNumber,
        email: updatedEmail,
        patientDetails: {
          ...patientDetails,
          birthDate: updatedBirthDate,
        },
      })
    );

    setEdit(false);
  };
  const handleLogOut = () => {
    dispatch(logout());
  };
  const handleCancel = () => {
    setUpdatedName(name);
    setUpdatedPhoneNumber(phoneNumber);
    setUpdatedEmail(email);
    setUpdatedBirthDate(birthDate);
    setEdit(false);
  };
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.profile}>Profile</div>
        <div className={styles.password}>Password</div>
        <div className={styles.signout} onClick={handleLogOut}>
          Sign Out
        </div>
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
              <button
                className={`${styles.editButton} ${edit ? styles.disabled : ""}`}
                onClick={handleEdit}
                disabled={edit}
              >
                Edit Profile
              </button>
              <button className={styles.editButton} onClick={params.closeModal}>
                Back
              </button>
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
              className={!edit ? styles.editable : styles.nonEditable}
              readOnly={!edit}
            />
          </div>

          <div className={styles.inputField}>
            <label>Date of Birth:</label>
            <input
              placeholder="MM/DD/YY"
              value={updatedBirthDate}
              onChange={(e) => setUpdatedBirthDate(e.target.value)}
              className={!edit ? styles.editable : styles.nonEditable}
              readOnly={!edit}
            />
          </div>

          <div className={styles.inputField}>
            <label>Phone:</label>
            <input
              placeholder="(123) 456-7890"
              value={updatedPhoneNumber}
              onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
              className={!edit ? styles.editable : styles.nonEditable}
              readOnly={!edit}
            />
          </div>

          <div className={styles.inputField}>
            <label>Email:</label>
            <input
              placeholder="blankemail@gmail"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              className={!edit ? styles.editable : styles.nonEditable}
              readOnly={!edit}
            />
          </div>
          {edit && (
            <div className={styles.buttons}>
              <button
                onClick={handleCancel}
                className={`${styles.editButton} ${styles.disabled}`}
              >
                Cancel
              </button>
              <button className={styles.editButton} onClick={handleSaveChanges}>
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
