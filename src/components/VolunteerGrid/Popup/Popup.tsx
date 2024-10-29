import React from "react";
import styles from "./Popup.module.css"; // make sure to create this CSS module file

const Popup = ({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <div className={styles.popupTitle}>Delete Account</div>
        <div className={styles.popupContent}>
          Deleting this account will remove all of this user&apos;s information
          from the database. This cannot be undone.
        </div>
        <div className={styles.popupActions}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Delete
          </button>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
