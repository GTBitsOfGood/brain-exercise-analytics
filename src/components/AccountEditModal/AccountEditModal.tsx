import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RootState } from "@src/redux/rootReducer";
import { formatPhoneNumber } from "@src/utils/utils";
import { update, logout } from "../../redux/reducers/authReducer/index";
import styles from "./AccountEditModal.module.css";
import ActiveIndicatorBox from "../ActiveIndicatorBox/ActiveIndicatorBox";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod } from "@/common_utils/types";

const Modal = () => {
  const [edit, setEdit] = useState<boolean>(false);
  const dispatch = useDispatch();
  const {
    firstName,
    lastName,
    phoneNumber,
    email,
    birthDate,
    patientDetails,
    adminDetails: { active },
  } = useSelector((state: RootState) => state.auth);
  const [updatedName, setUpdatedName] = useState<string>(
    `${firstName} ${lastName}`
  );
  const [updatedPhoneNumber, setUpdatedPhoneNumber] =
    useState<string>(phoneNumber);
  const [updatedEmail, setUpdatedEmail] = useState<string>(email);

  const router = useRouter();

  function formatDateToString(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
  const [unupdatedBirthDate, setUnupdatedBirthDate] = useState(
    new Date(birthDate)
  );
  const [updatedBirthDate, setUpdatedBirthDate] = useState(new Date(birthDate));
  const [updatedBirthDateInput, setUpdatedBirthDateInput] = useState(
    formatDateToString(new Date(birthDate))
  );

  useEffect(() => {
    if (updatedBirthDateInput) {
      const dateArray = updatedBirthDateInput.split("/");
      if (dateArray.length === 3) {
        const [month, day, year] = dateArray.map(Number);
        const updatedDate = new Date(year, month - 1, day);
        if (!Number.isNaN(updatedDate.getTime())) {
          setUpdatedBirthDate(updatedDate);
        }
      }
    }
  }, [updatedBirthDateInput]);

  const handleLogOut = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSaveChanges = () => {
    dispatch(
      update({
        firstName: updatedName.split(" ")[0] ?? "",
        lastName: updatedName.split(" ")[1] ?? "",
        phoneNumber: updatedPhoneNumber,
        email: updatedEmail,
        birthDate: updatedBirthDate,
        patientDetails: {
          ...patientDetails,
        },
      })
    );
    setUnupdatedBirthDate(updatedBirthDate);
    setEdit(false);
  };

  const handleCancel = () => {
    setUpdatedName(`${firstName} ${lastName}`);
    setUpdatedPhoneNumber(phoneNumber);
    setUpdatedEmail(email);
    setUpdatedBirthDate(unupdatedBirthDate);
    setUpdatedBirthDateInput(unupdatedBirthDate.toLocaleDateString("en-US"));
    setEdit(false);
  };

  const formatBirthDate = (input: string): string => {
    const numericInput: string = input.replace(/\D/g, "");
    const maxLength = 8;
    const truncatedInput = numericInput.slice(0, maxLength);
    let formattedInput = "";
    for (let i = 0; i < truncatedInput.length; i += 1) {
      if (i === 2 || i === 4) {
        formattedInput += "/";
      }
      formattedInput += truncatedInput[i];
    }
    return formattedInput;
  };
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    if (rawValue.length > 10) return;
    setUpdatedPhoneNumber(rawValue);
  };
  const handleChangeImage = async () => {
    const ret = await internalRequest({
      url: "/api/volunteer/uploadImage",
      method: HttpMethod.POST,
      body: {},
    });
    console.log(ret);
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
          <button onClick={handleChangeImage}>
            <img
              src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/141.jpg"
              alt="Description of the image"
            />
          </button>
          <div className={styles.myContainer}>
            <div className={styles.first}>
              <label>{`${firstName} ${lastName}`}</label>
              <ActiveIndicatorBox active={active} />
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
              className={!edit ? styles.nonEditable : styles.editable}
              readOnly={!edit}
            />
          </div>

          <div className={styles.inputField}>
            <label>Date of Birth:</label>
            <input
              placeholder="mm/dd/yyyy"
              value={updatedBirthDateInput}
              onChange={(e) => {
                const formattedDate = formatBirthDate(e.target.value);
                setUpdatedBirthDateInput(formattedDate);
              }}
              className={!edit ? styles.nonEditable : styles.editable}
              readOnly={!edit}
            />
          </div>

          <div className={styles.inputField}>
            <label>Phone:</label>
            <input
              placeholder="(123) 456-7890"
              value={formatPhoneNumber(updatedPhoneNumber) || ""}
              onChange={(e) => {
                handlePhoneChange(e);
              }}
              className={!edit ? styles.nonEditable : styles.editable}
              readOnly={!edit}
            />
          </div>

          <div className={styles.inputField}>
            <label>Email:</label>
            <input
              placeholder="blankemail@gmail"
              value={updatedEmail}
              onChange={(e) => setUpdatedEmail(e.target.value)}
              className={!edit ? styles.nonEditable : styles.editable}
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
