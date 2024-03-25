"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const useHash = () => {
  const params = useParams();
  const [hash, setHash] = useState("");

  const onHashChanged = useCallback(() => {
    const currentHash = window.location.hash.replace("#", "");
    setHash(currentHash);
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", onHashChanged);
    return () => {
      window.removeEventListener("hashchange", onHashChanged);
    };
  }, [onHashChanged]);

  useEffect(() => {
    onHashChanged();
  }, [params, onHashChanged]);

  return hash;
};

export default useHash;
