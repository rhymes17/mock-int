import { BroadcastedInterviewRequest } from "@/types";
import Card from "./Card";
import Image from "next/image";
import { redirect } from "next/navigation";

const BroadcastedInterviewRequestCard = ({
  interviewRequest,
  requestDirection,
}: {
  interviewRequest: BroadcastedInterviewRequest;
  requestDirection: "sent" | "received";
}) => {
  const { role, requests, interviewer } = interviewRequest;

  const getButtonTitle = () => {
    if (interviewRequest.isAccepted) {
      return "Scheduled";
    }
    if (interviewRequest.isWithdrawn) {
      return "Withdrawn";
    }
    return "Check Request";
  };

  return (
    <Card
      handleButtonClick={() => {
        redirect(
          `/requests/broadcasted/${requestDirection}/${interviewRequest._id}`
        );
      }}
      buttonTitle={getButtonTitle()}
      buttonDisabled={
        interviewRequest.isAccepted || interviewRequest.isWithdrawn
      }
    >
      <div className="flex flex-col gap-4">
        <h1 className="text-2xl font-[600]">{role}</h1>
        <div></div>
        <div className="flex gap-6 items-center">
          <div className="h-[2rem] w-[2rem] rounded-full">
            <Image
              src={interviewer.avatar}
              alt="interviewee profile picture"
              height={100}
              width={100}
              className="rounded-full border border-white "
            />
          </div>
          {requests.map((request) => (
            <div className="h-[2rem] w-[2rem] rounded-full absolute left-10">
              <Image
                src={request.user.avatar}
                alt="interviewee profile picture"
                height={100}
                width={100}
                className="rounded-full border border-white "
              />
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BroadcastedInterviewRequestCard;
