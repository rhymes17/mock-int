import { PeerToPeerInterviewRequest } from "@/types";
import Card from "./Card";
import Image from "next/image";
import { redirect } from "next/navigation";

const InterviewRequestCard = ({
  interviewRequest,
}: {
  interviewRequest: PeerToPeerInterviewRequest;
  setSelectedInterviewRequest: React.Dispatch<
    React.SetStateAction<PeerToPeerInterviewRequest | null>
  >;
  setIsInterviewRequestDetailsVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) => {
  const { role, interviewee, interviewer } = interviewRequest;

  const getButtonTitle = () => {
    if (interviewRequest.isAccepted) {
      return "Scheduled";
    }
    if (interviewRequest.isRejected) {
      return "Rejected";
    }
    if (interviewRequest.isWithdrawn) {
      return "Withdrawn";
    }
    return "Check Request";
  };

  return (
    <Card
      handleButtonClick={() => {
        redirect(`/requests/${interviewRequest._id}`);
      }}
      buttonTitle={getButtonTitle()}
      buttonDisabled={
        interviewRequest.isAccepted ||
        interviewRequest.isRejected ||
        interviewRequest.isWithdrawn
      }
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-[600]">{role}</h1>
        <div>
          {/* <h3>Date: {interviewDateAndTime.toDateString()}</h3>
          <h3>Time: {interviewDateAndTime.toLocaleTimeString()}</h3> */}
        </div>
        <div className="flex gap-6 items-center">
          <div className="h-[2rem] w-[2rem] rounded-full">
            <Image
              src={interviewee.avatar}
              alt="interviewee profile picture"
              height={100}
              width={100}
              className="rounded-full border border-white"
            />
          </div>
          <div className="h-[2rem] w-[2rem] rounded-full absolute left-10">
            <Image
              src={interviewer.avatar}
              alt="interviewee profile picture"
              height={100}
              width={100}
              className="rounded-full border border-white "
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default InterviewRequestCard;
