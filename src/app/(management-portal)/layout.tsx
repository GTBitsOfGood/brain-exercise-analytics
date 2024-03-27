"use client";

import { useEffect, useState } from "react";
import { update } from "@src/redux/reducers/authReducer";
import NavigationPanel from "@src/components/NavigationPanel/NavigationPanel";
import AccountEditModal from "@src/components/AccountEditModal/AccountEditModal";
import { internalRequest } from "@src/utils/requests";
import { HttpMethod, IAuthUserCookie, IUser } from "@/common_utils/types";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@src/redux/rootReducer";
import { getCookie, setCookie } from "cookies-next";

import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { email } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    const retrieve = async () => {
      const user: IUser = await internalRequest({
        url: "/api/volunteer",
        method: HttpMethod.GET,
        authRequired: true,
        queryParams: {
          email,
        },
      });
      dispatch(update(user));

      // Update cookie if it does not match the retrieved user
      const authUserCookie = getCookie("authUser");
      if (authUserCookie) {
        const parsedCookie = JSON.parse(authUserCookie) as IAuthUserCookie;
        const { user: authUser, keepLogged } = parsedCookie;
        if (JSON.stringify(authUser) !== JSON.stringify(user)) {
          setCookie(
            "authUser",
            { user, keepLogged },
            keepLogged ? { maxAge: 7 * 24 * 60 * 60 } : undefined,
          );
        }
      }
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
