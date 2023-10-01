"use client";

import { useRouter } from "next/navigation";

export default function Redirect() {
  const router = useRouter();

  router.push("/auth/information", { scroll: false });
}
