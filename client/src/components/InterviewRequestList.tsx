import {
  useGetPeerToPeerInterviewReceivedRequests,
  useGetPeerToPeerInterviewSentRequests,
} from "@/hooks/useInterview";
import InterviewRequestCard from "./InterviewRequestCard";

const InterviewRequestList = ({
  requestType,
}: {
  requestType: "sent" | "received";
}) => {
  const queryFn =
    requestType === "sent"
      ? useGetPeerToPeerInterviewSentRequests
      : useGetPeerToPeerInterviewReceivedRequests;

  const { data: interviewRequests, isLoading, isError } = queryFn();

  console.log({ interviewRequests });

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
        <InterviewRequestCard interviewRequest={interviewRequest} />
      ))}
    </div>
  );
};

export default InterviewRequestList;
