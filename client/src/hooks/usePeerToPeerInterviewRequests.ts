import {
  acceptPeerToPeerInterview,
  getPeerToPeerInterviewReceivedRequests,
  getPeerToPeerInterviewRequest,
  getPeerToPeerInterviewSentRequests,
  requestPeerToPeerInterview,
} from "@/services/peerToPeerInterviewRequestService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useRequestPeerToPeerInterview = () => {
  return useMutation({
    mutationKey: ["request-peer-to-peer-interview"],
    mutationFn: requestPeerToPeerInterview,
  });
};

export const useGetPeerToPeerInterviewSentRequests = () => {
  return useQuery({
    queryKey: ["sent-peer-to-peer-requests"],
    queryFn: getPeerToPeerInterviewSentRequests,
  });
};

export const useGetPeerToPeerInterviewRequest = (requestId: string) => {
  return useQuery({
    queryKey: ["peer-to-peer-request"],
    queryFn: () => getPeerToPeerInterviewRequest(requestId),
  });
};

export const useGetPeerToPeerInterviewReceivedRequests = () => {
  return useQuery({
    queryKey: ["received-peer-to-peer-requests"],
    queryFn: getPeerToPeerInterviewReceivedRequests,
  });
};

export const useAcceptPeerToPeerInterview = () => {
  return useMutation({
    mutationKey: ["accept-peer-to-peer-interview"],
    mutationFn: acceptPeerToPeerInterview,
  });
};
