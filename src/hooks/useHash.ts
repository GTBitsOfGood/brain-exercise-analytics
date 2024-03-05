"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const useHash = () => {
  const params = useParams();
  const [hash, setHash] = useState("");

  useEffect(() => {
    const currentHash = window.location.hash.replace("#", "");
    setHash(currentHash);
  }, [params]);

  return hash;
};

export default useHash;
