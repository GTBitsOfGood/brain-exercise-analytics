import { useState } from "react";
import passwordReset from "@src/firebase/password_reset";
import { Error as ErrorIcon } from "@mui/icons-material";
import styles from "./AccountEditModal.module.css";

export default function Password() {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const handleSaveChanges = async () => {
    setSuccess(false);
    setError(null);
    if (confirmNewPassword !== newPassword) {
      setError("Passwords do not match");
    } else {
      try {
        await passwordReset(oldPassword, newPassword);
        setSuccess(true);
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    }
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
        {error && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingTop: "10px",
            }}
          >
            <ErrorIcon style={{ color: "#ff0000" }} sx={{ width: "18px" }} />
            <p
              style={{
                fontWeight: 500,
                color: "#ff0000",
                paddingLeft: "5px",
                fontSize: "11px",
              }}
            >
              {error}
            </p>
          </div>
        )}
        {success && (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingTop: "10px",
            }}
          >
            <p
              style={{
                fontWeight: 500,
                color: "#14ae5c",
                paddingLeft: "5px",
                fontSize: "11px",
              }}
            >
              {"Password Changed!"}
            </p>
          </div>
        )}
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
