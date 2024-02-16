"use client";
import { useState } from "react";

export default function useModal() {
  const [showModal, setShowModal] = useState<boolean>(true);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return {
    showModal,
    openModal,
    closeModal,
  };
}
