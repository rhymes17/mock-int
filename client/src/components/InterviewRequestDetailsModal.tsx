import { PeerToPeerInterviewRequest } from "@/types";
import BottomSheet from "./BottomSheet";
import Image from "next/image";
import { useAuth } from "@/providers/AuthProvider";
import { useUserDetailsModal } from "@/providers/UserDetailsModalProvider";

const InterviewRequestDetailsModal = ({
  interviewRequest,
  isInterviewRequestDetailsVisible,
  setIsInterviewRequestDetailsVisible,
}: {
  interviewRequest: PeerToPeerInterviewRequest;
  isInterviewRequestDetailsVisible: boolean;
  setIsInterviewRequestDetailsVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) => {
  const { user } = useAuth();
  const { setUser, setIsModalVisible, setInterviewRequest, setCtaType } =
    useUserDetailsModal();
  const { role, availability, interviewee, interviewer } = interviewRequest;
  // const interviewDateAndTime = new Date(time);
  console.log({ availability });

  const otherParty =
    interviewee.email === user?.email ? interviewer : interviewee;

  const userRole =
    interviewee.email === user?.email ? "Interviewee" : "Interviewer";

  const handleUserSelected = () => {
    setUser(otherParty);
    setIsModalVisible(true);
    setCtaType("accept");
    setInterviewRequest(interviewRequest);
    setIsInterviewRequestDetailsVisible(false);
  };

  return (
    <BottomSheet
      isBottomSheetVisible={isInterviewRequestDetailsVisible}
      setIsBottomSheetVisible={setIsInterviewRequestDetailsVisible}
      isModal={true}
    >
      <div className="flex flex-col gap-5">
        <div className="">
          <h1 className="text-3xl font-bold">{role}</h1>
          <div>
            {/* <h3>Date: {interviewDateAndTime.toDateString()}</h3>
            <h3>Time: {interviewDateAndTime.toLocaleTimeString()}</h3> */}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div
            onClick={handleUserSelected}
            className="flex gap-2 items-center w-fit px-2 py-2 rounded-xl shadow-2xl cursor-pointer"
          >
            <div className="h-[2rem] w-[2rem] rounded-full">
              <Image
                src={otherParty.avatar}
                alt="other party profile picture"
                height={100}
                width={100}
                className="rounded-full border border-white"
              />
            </div>
            <h3>{otherParty.name}</h3>
          </div>
          <h2 className="">
            requested an interview with you and has invited you to be an{" "}
            <span className="underline">{userRole}</span>
          </h2>
        </div>
      </div>
    </BottomSheet>
  );
};

export default InterviewRequestDetailsModal;
