import { useRouter } from "next/navigation";
import { CSSProperties, useState } from "react";
import { classes } from "@src/utils/utils";

import useAuth from "@src/hooks/useAuth";
import styles from "./AccountEditModal.module.css";
import Profile from "./Profile";
import Password from "./Password";

const enum Page {
  PROFILE,
  PASSWORD,
}

interface Props {
  className?: string;
  style?: CSSProperties;
  setShowSuccessModal: (args: boolean) => void;
}

const Modal = ({ className, style, setShowSuccessModal }: Props) => {
  const [page, setPage] = useState<Page>(Page.PROFILE);
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogOut = async () => {
    await logout();
    router.push("/auth/login");
  };

  return (
    <div className={classes(styles.container, className)} style={style}>
      <div className={styles.left}>
        <div
          className={styles.profile}
          style={page === Page.PROFILE ? { backgroundColor: "#E3EAFC" } : {}}
          onClick={() => setPage(Page.PROFILE)}
        >
          Profile
        </div>
        <div
          className={styles.password}
          style={page === Page.PASSWORD ? { backgroundColor: "#E3EAFC" } : {}}
          onClick={() => setPage(Page.PASSWORD)}
        >
          Password
        </div>
        <div className={styles.signout} onClick={handleLogOut}>
          Sign Out
        </div>
      </div>
      <div className={styles.vl}></div>
      <div className={styles.info}>
        {/* <span onClick={closeModal}>&times;</span> */}
        {page === Page.PROFILE ? (
          <Profile setShowSuccessModal={setShowSuccessModal} />
        ) : (
          <Password setShowSuccessModal={setShowSuccessModal} />
        )}
      </div>
    </div>
  );
};

export default Modal;
