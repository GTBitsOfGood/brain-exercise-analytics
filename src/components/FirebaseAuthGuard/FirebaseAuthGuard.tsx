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
        console.log("FirebaseAuthGuard: User is not logged in");
        dispatch(logout());
        // router.push("/auth/login");
      }
    });
    return unsubscribe;
  }, [dispatch, router]);

  return <>{children}</>;
}
