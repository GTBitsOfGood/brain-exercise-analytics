"use client";

/* eslint-disable consistent-return */

import { HttpMethod, IUser } from "@/common_utils/types";
import { login, logout } from "@src/redux/reducers/authReducer";
import { RootState } from "@src/redux/rootReducer";
import { internalRequest } from "@src/utils/requests";
import { deleteCookie } from "cookies-next";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function useAuthRedirect() {
  const user = useSelector<RootState>((state) => state.auth) as IUser;
  const navigation = useRouter();
  const dispatch = useDispatch();
  const pathName = usePathname();
  const auth = getAuth();

  const [loading, setLoading] = useState(true);
  const [firstRetrieval, setFirstRetrieval] = useState(true);

  const getAndStoreUser = useCallback(
    async (email: string | null): Promise<void> => {
      const fetchedUser = await internalRequest<IUser>({
        url: "/api/volunteer/auth/login",
        method: HttpMethod.GET,
        body: {
          email,
        },
      });
      dispatch(login(fetchedUser));
      setFirstRetrieval(false);
    },
    [dispatch],
  );

  useEffect(() => {
    async function checkAndRedirect(currentUser: User | null): Promise<void> {
      if (!currentUser) {
        if (pathName !== "/auth/login" && pathName !== "/auth/signup") {
          deleteCookie("authUser", { path: "/" });
          dispatch(logout());
          return navigation.push("/auth/login");
        }
        return setLoading(false);
      }

      if (user) {
        if (currentUser.email === user.email) {
          if (user.verified) {
            if (user.signedUp) {
              return setLoading(false);
            }
            if (pathName === "/auth/information") {
              if (firstRetrieval) {
                await getAndStoreUser(currentUser.email);
              } else {
                setLoading(false);
              }
              return;
            }
            return navigation.push("/auth/information");
          }
          if (pathName === "/auth/email-verification") {
            if (firstRetrieval) {
              await getAndStoreUser(currentUser.email);
            } else {
              setLoading(false);
            }
            return;
          }
          return navigation.push("/auth/email-verification");
        }
        await getAndStoreUser(currentUser.email);
      }
    }
    return onAuthStateChanged(auth, checkAndRedirect);
  }, [
    user,
    navigation,
    dispatch,
    pathName,
    auth,
    getAndStoreUser,
    firstRetrieval,
  ]);

  return loading;
}
