import {
  useGetPeerToPeerInterviewReceivedRequests,
  useGetPeerToPeerInterviewSentRequests,
} from "@/hooks/useInterview";
import InterviewRequestCard from "./InterviewRequestCard";
import { InterviewRequest } from "@/types";

const InterviewRequestList = ({
  requestType,
  setSelectedInterviewRequest,
  setIsInterviewRequestDetailsVisible,
}: {
  requestType: "sent" | "received";
  setSelectedInterviewRequest: React.Dispatch<
    React.SetStateAction<InterviewRequest | null>
  >;
  setIsInterviewRequestDetailsVisible: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}) => {
  const queryFn =
    requestType === "sent"
      ? useGetPeerToPeerInterviewSentRequests
      : useGetPeerToPeerInterviewReceivedRequests;

  const { data: interviewRequests, isLoading, isError } = queryFn();

  if (isLoading) {
    return <h1>Fetching Requests....</h1>;
  }

  if (isError || !interviewRequests) {
    return <h1>Error..</h1>;
  }

  if (interviewRequests.length < 1) {
    return <h1>No requests found</h1>;
  }

  return (
    <div className="grid grid-cols-4 gap-5 gap-y-8 h-full py-5">
      {interviewRequests.map((interviewRequest) => (
        <InterviewRequestCard
          key={interviewRequest._id}
          interviewRequest={interviewRequest}
          setSelectedInterviewRequest={setSelectedInterviewRequest}
          setIsInterviewRequestDetailsVisible={
            setIsInterviewRequestDetailsVisible
          }
        />
      ))}
    </div>
  );
};

export default InterviewRequestList;
