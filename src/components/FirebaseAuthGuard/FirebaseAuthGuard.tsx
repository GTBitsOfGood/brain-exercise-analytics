"use client";

import firebaseInit from "@src/firebase/config";
import { logout } from "@src/redux/reducers/authReducer";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

firebaseInit();

export default function FirebaseAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (!user) {
        // Do not redirect after logging out. The middleware will handle that on page reload.
        dispatch(logout());
      }
    });
    return unsubscribe;
  }, [dispatch, router]);

  return <>{children}</>;
}
