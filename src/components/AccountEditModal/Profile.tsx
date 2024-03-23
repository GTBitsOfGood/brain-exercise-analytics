import { useDispatch, useSelector } from "react-redux";
import { formatPhoneNumber } from "@src/utils/utils";
import { useEffect, useState } from "react";
import { RootState } from "@src/redux/rootReducer";
import { update } from "@src/redux/reducers/authReducer";
import { PencilIcon } from "@src/app/icons";
import ActiveIndicatorBox from "../ActiveIndicatorBox/ActiveIndicatorBox";
import styles from "./AccountEditModal.module.css";

export default function Profile() {
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
  const [updatedFirstName, setUpdatedFirstName] = useState<string>(
    `${firstName}`,
  );
  const [updatedLastName, setUpdatedLastName] = useState<string>(`${lastName}`);
  const [updatedPhoneNumber, setUpdatedPhoneNumber] =
    useState<string>(phoneNumber);
  const [updatedEmail, setUpdatedEmail] = useState<string>(email);

  function formatDateToString(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  }
  const [unupdatedBirthDate, setUnupdatedBirthDate] = useState(
    new Date(birthDate),
  );
  const [updatedBirthDate, setUpdatedBirthDate] = useState(new Date(birthDate));
  const [updatedBirthDateInput, setUpdatedBirthDateInput] = useState(
    formatDateToString(new Date(birthDate)),
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

  const handleEdit = () => {
    setEdit(true);
  };

  const handleSaveChanges = () => {
    dispatch(
      update({
        firstName: updatedFirstName,
        lastName: updatedLastName,
        phoneNumber: updatedPhoneNumber,
        email: updatedEmail,
        birthDate: updatedBirthDate,
        patientDetails: {
          ...patientDetails,
        },
      }),
    );
    setUnupdatedBirthDate(updatedBirthDate);
    setEdit(false);
  };

  const handleCancel = () => {
    setUpdatedFirstName(firstName);
    setUpdatedLastName(lastName);
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

  return (
    <>
      <div className={styles.header}>
        <img
          src="https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/141.jpg"
          alt="Description of the image"
        />
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
          </div>
        </div>
      </div>
      <div className={styles.inputs}>
        <div className={styles.inputHeader}>
          <label>Profile Details</label>
          <button
            className={`${styles.editButton} ${edit ? styles.disabled : ""}`}
            style={{ marginLeft: "auto" }}
            onClick={handleEdit}
            disabled={edit}
          >
            <PencilIcon />
          </button>
        </div>
        <div className={styles.inputFieldRow}>
          <div className={styles.inputField}>
            <label>First Name</label>
            <input
              placeholder="First Name"
              value={updatedFirstName}
              onChange={(e) => setUpdatedFirstName(e.target.value)}
              className={!edit ? styles.nonEditable : styles.editable}
              readOnly={!edit}
            />
          </div>
          <div className={styles.inputField}>
            <label>Last Name</label>
            <input
              placeholder="Last Name"
              value={updatedLastName}
              onChange={(e) => setUpdatedLastName(e.target.value)}
              className={!edit ? styles.nonEditable : styles.editable}
              readOnly={!edit}
            />
          </div>
        </div>

        <div className={styles.inputField}>
          <label>Date of Birth</label>
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
          <label>Phone</label>
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
              className={`${styles.submitButton} ${styles.disabled}`}
            >
              Cancel
            </button>
            <button className={styles.submitButton} onClick={handleSaveChanges}>
              Save Changes
            </button>
          </div>
        )}
      </div>
    </>
  );
}
