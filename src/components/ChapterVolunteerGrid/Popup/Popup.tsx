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
        <div className={styles.popupTitle}>Remove from Chapter</div>
        <div className={styles.popupContent}>
          This will remove the volunteer from the chapter. Please confirm to
          proceed.
        </div>
        <div className={styles.popupActions}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            Remove
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
