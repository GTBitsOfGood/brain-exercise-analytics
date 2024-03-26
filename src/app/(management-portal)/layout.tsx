"use client";

import { useEffect, useState } from "react";
import { update } from "@src/redux/reducers/authReducer";
import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import AccountEditModal from "@src/components/AccountEditModal/AccountEditModal";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod, IUser } from "@/common_utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { email } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const retrieve = async () => {
      const response: IUser = await internalRequest({
        url: "/api/volunteer",
        method: HttpMethod.GET,
        authRequired: true,
        queryParams: {
          email,
        },
      });
      dispatch(update(response));
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
        {showModal && (
          <div className={styles.accountEditModal}>
            <div
              className={styles.modalBackground}
              onClick={() => setShowModal(false)}
            />
            <div className={styles.accountEditModalContent}>
              <AccountEditModal />
            </div>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
