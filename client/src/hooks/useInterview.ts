import {
  acceptPeerToPeerInterview,
  getInterviewees,
  getInterviewers,
  getPeerToPeerInterviewReceivedRequests,
  getPeerToPeerInterviewSentRequest,
  getPeerToPeerInterviewSentRequests,
  requestPeerToPeerInterview,
} from "@/services/interviewService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetInterviewers = () => {
  return useQuery({
    queryKey: ["interviewers"],
    queryFn: getInterviewers,
  });
};

export const useGetInterviewees = () => {
  return useQuery({
    queryKey: ["interviewees"],
    queryFn: getInterviewees,
  });
};

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

export const useGetPeerToPeerInterviewSentRequest = (requestId: string) => {
  return useQuery({
    queryKey: ["sent-peer-to-peer-request"],
    queryFn: () => getPeerToPeerInterviewSentRequest(requestId),
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
