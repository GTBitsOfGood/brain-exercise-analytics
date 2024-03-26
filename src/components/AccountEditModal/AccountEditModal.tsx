import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "../../redux/reducers/authReducer/index";
import styles from "./AccountEditModal.module.css";
import Profile from "./Profile";
import Password from "./Password";

const enum Page {
  PROFILE,
  PASSWORD,
}

const Modal = () => {
  const [page, setPage] = useState<Page>(Page.PROFILE);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOut = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  return (
    <div className={styles.container}>
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
        {page === Page.PROFILE ? <Profile /> : <Password />}
      </div>
    </div>
  );
};

export default Modal;
