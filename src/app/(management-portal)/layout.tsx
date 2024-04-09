"use client";

import { useEffect, useState } from "react";
import { logout, update } from "@src/redux/reducers/authReducer";
import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import AccountEditModal from "@src/components/AccountEditModal/AccountEditModal";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod, IUser } from "@/common_utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";

import Modal from "@src/components/Modal/Modal";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { email } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const retrieve = async () => {
      if (!email) {
        dispatch(logout());
        return;
      }

      const user: IUser = await internalRequest({
        url: "/api/volunteer",
        method: HttpMethod.GET,
        authRequired: true,
        queryParams: {
          email,
        },
      });
      dispatch(update(user));
    };
    try {
      retrieve();
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, email]);

  return (
    <div className={styles.wrapper}>
      <div className={styles["navigation-panel"]}>
        <NavigationPanel onClick={() => setShowModal(!showModal)} />
      </div>
      <div className={styles["rest-of-page"]}>
        <Modal showModal={showModal} setShowModal={setShowModal}>
          <AccountEditModal className={styles.accountEditModalContent} />
        </Modal>
        {children}
      </div>
    </div>
  );
}
