"use client";

import { useEffect } from "react";

const BottomSheet = ({
  isBottomSheetVisible,
  setIsBottomSheetVisible,
  children,
}: {
  isBottomSheetVisible: boolean;
  setIsBottomSheetVisible: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    if (isBottomSheetVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isBottomSheetVisible]);

  if (!isBottomSheetVisible) return null;

  return (
    <div className="fixed bottom-0 h-[100%] w-[100%] bg-white/10 z-20 backdrop-blur-[3px] left-0 right-0 mx-auto border">
      <div
        onClick={() => setIsBottomSheetVisible(false)}
        className="text-3xl absolute right-5 top-5 cursor-pointer"
      >
        X
      </div>

      <div className="absolute bottom-2 h-[80%] w-[98%] left-0 right-0 mx-auto bg-white rounded-2xl p-8">
        {children}
      </div>
    </div>
  );
};

export default BottomSheet;
