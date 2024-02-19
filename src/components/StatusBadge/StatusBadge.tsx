import React from "react";
import styles from "./StatusBadge.module.css";
interface StatusBadgeProps {
  isOnline: boolean;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ isOnline }) => {
  return (
    <div>
      <div
        className={`${styles.statusBadge} ${isOnline ? styles.online : styles.offline}`}
      >
        <span>{isOnline ? "Active" : "Offline"}</span>
      </div>
    </div>
  );
};

export default StatusBadge;
