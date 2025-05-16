import { InterviewRequest } from "@/types";
import { useState } from "react";
import BottomSheet from "./BottomSheet";

const InterviewRequestDetailsModal = ({
  interviewRequest,
  isInterviewRequestDetailsVisible,
  setIsInterviewRequestDetailsVisible,
}: {
  interviewRequest: InterviewRequest;
  isInterviewRequestDetailsVisible: boolean;
  setIsInterviewRequestDetailsVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) => {
  return (
    <BottomSheet
      isBottomSheetVisible={isInterviewRequestDetailsVisible}
      setIsBottomSheetVisible={setIsInterviewRequestDetailsVisible}
    >
      <div>Interview Request</div>
    </BottomSheet>
  );
};

export default InterviewRequestDetailsModal;
