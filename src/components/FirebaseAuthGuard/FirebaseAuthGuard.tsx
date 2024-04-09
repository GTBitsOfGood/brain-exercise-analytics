"use client";

import firebaseInit from "@src/firebase/config";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@src/hooks/useAuth";

firebaseInit();

export default function FirebaseAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (!user) {
        // Do not redirect after logging out. The middleware will handle that on page reload.
        logout();
      }
    });
    return unsubscribe;
  }, [logout, router]);

  return <>{children}</>;
}
