import { useState } from "react";
import styles from "./AccountEditModal.module.css";

export default function Password() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const handleSaveChanges = () => {
    // Add code to save changes
  };

  const handleCancel = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  };
  return (
    <>
      <div className={styles.inputs}>
        <div className={styles.inputHeader}>
          <label>Change Password</label>
        </div>
        <div className={styles.inputField}>
          <label>Old Password</label>
          <input
            placeholder="Old Password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className={styles.editable}
          />
        </div>
        <div className={styles.inputField}>
          <label>New Password</label>
          <input
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.editable}
          />
        </div>

        <div className={styles.inputField}>
          <label>Confirm Password</label>
          <input
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={styles.editable}
          />
        </div>
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
      </div>
    </>
  );
}
