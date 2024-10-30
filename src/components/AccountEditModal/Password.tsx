import { FormEvent, MouseEvent, useState } from "react";
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import styles from "./AccountEditModal.module.css";
import InputField from "../InputField/InputField";

interface Props {
  setShowSuccessModal: (args: boolean) => void;
}

  export default function Password({setShowSuccessModal}: Props) {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmNewPasswordError, setConfirmNewPasswordError] = useState("");

  const resetErrors = () => {
    setOldPasswordError("");
    setNewPasswordError("");
    setConfirmNewPasswordError("");
  };

  const reset = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
    resetErrors();
  };

  const handleSaveChanges = async (
    e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    resetErrors();
    let error = false;
    if (oldPassword === "") {
      setOldPasswordError("Old password cannot be blank");
      error = true;
    }
    if (newPassword === "") {
      setNewPasswordError("New password cannot be blank");
      error = true;
    }
    if (confirmNewPassword === "") {
      setConfirmNewPasswordError("Confirm password cannot be blank");
      error = true;
    }

    if (error) {
      return;
    }

    if (newPassword.length < 6) {
      setNewPasswordError("New password should be of at least 6 characters");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setNewPasswordError(" ");
      setConfirmNewPasswordError("Confirm password should match new password");
      return;
    }

    const user = getAuth().currentUser!;
    const credential = EmailAuthProvider.credential(user.email!, oldPassword);
    try {
      await reauthenticateWithCredential(user, credential);
    } catch {
      setOldPasswordError("Old password is incorrect");
      return;
    }

    await updatePassword(getAuth().currentUser!, newPassword);
    setShowSuccessModal(true)
    reset();
  };

  return (
    <>
      <form className={styles.inputs} onSubmit={handleSaveChanges}>
        <div className={styles.inputHeader}>
          <label>Change Password</label>
        </div>
        <div className={styles.inputField}>
          <label>Old Password</label>
          <InputField
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            type="password"
            showError={oldPasswordError !== ""}
            error={oldPasswordError}
          />
        </div>
        <div className={styles.inputField}>
          <label>New Password</label>
          <InputField
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            type="password"
            showError={newPasswordError !== ""}
            error={newPasswordError}
          />
        </div>

        <div className={styles.inputField}>
          <label>Confirm Password</label>
          <InputField
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            type="password"
            showError={confirmNewPasswordError !== ""}
            error={confirmNewPasswordError}
          />
        </div>
        <div className={styles.buttons}>
          <button
            type="button"
            onClick={reset}
            className={`${styles.submitButton} ${styles.disabled}`}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            onClick={handleSaveChanges}
          >
            Save Changes
          </button>
        </div>
      </form>
    </>
  );
}
