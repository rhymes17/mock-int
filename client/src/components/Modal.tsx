import React, { useState } from "react";

const Modal = ({
  isModalOpen,
  setIsModalOpen,
  children,
}: {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  if (!isModalOpen) return null;

  return (
    <div className="fixed bottom-0 h-[100%] w-[100%] bg-white/10 z-20 backdrop-blur-[3px] left-0 right-0 mx-auto border">
      <div
        onClick={() => setIsModalOpen(false)}
        className="text-3xl absolute right-5 top-5 cursor-pointer"
      >
        X
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 w-fit left-0 right-0 mx-auto bg-white rounded-2xl p-8">
        {children}
      </div>
    </div>
  );
};

export default Modal;
