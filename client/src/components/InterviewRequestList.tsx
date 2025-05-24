import {
  useGetPeerToPeerInterviewReceivedRequests,
  useGetPeerToPeerInterviewSentRequests,
} from "@/hooks/usePeerToPeerInterviewRequests";
import {
  useGetBroadcastedInterviewReceivedRequests,
  useGetBroadcastedInterviewSentRequests,
} from "@/hooks/useBroadcastedInterviewRequests";
import {
  BroadcastedInterviewRequest,
  PeerToPeerInterviewRequest,
} from "@/types";
import PeerToPeerInterviewRequestCard from "./PeerToPeerInterviewRequestCard";
import BroadcastedInterviewRequestCard from "./BroadcastedInterviewRequestCard";

const getQueryFn = ({
  requestDirection,
  requestType,
}: {
  requestDirection: "sent" | "received";
  requestType: "peer-to-peer" | "broadcasted";
}) => {
  if (requestDirection === "sent") {
    if (requestType === "peer-to-peer") {
      return useGetPeerToPeerInterviewSentRequests;
    } else {
      return useGetBroadcastedInterviewSentRequests;
    }
  } else {
    if (requestType === "peer-to-peer") {
      return useGetPeerToPeerInterviewReceivedRequests;
    } else {
      return useGetBroadcastedInterviewReceivedRequests;
    }
  }
};

const InterviewRequestList = ({
  requestDirection,
  requestType,
}: {
  requestDirection: "sent" | "received";
  requestType: "peer-to-peer" | "broadcasted";
}) => {
  const {
    data: interviewRequests,
    isLoading,
    isError,
  } = getQueryFn({ requestDirection, requestType })();

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
      {requestType === "peer-to-peer"
        ? interviewRequests.map((interviewRequest) => (
            <PeerToPeerInterviewRequestCard
              key={interviewRequest._id}
              interviewRequest={interviewRequest as PeerToPeerInterviewRequest}
              requestDirection={requestDirection}
            />
          ))
        : interviewRequests.map((interviewRequest) => (
            <BroadcastedInterviewRequestCard
              key={interviewRequest._id}
              interviewRequest={interviewRequest as BroadcastedInterviewRequest}
              requestDirection={requestDirection}
            />
          ))}
    </div>
  );
};

export default InterviewRequestList;
