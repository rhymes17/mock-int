import {
  acceptBroadcastedInterview,
  applyToBroadcastedInterview,
  getBroadcastedInterviewReceivedRequests,
  getBroadcastedInterviewRequest,
  getBroadcastedInterviewSentRequests,
  postBroadcastedInterview,
} from "@/services/broadcastedInterviewRequestService";
import { useMutation, useQuery } from "@tanstack/react-query";

export const usePostBroadcastedInterview = () => {
  return useMutation({
    mutationKey: ["post-broadcasted-interview"],
    mutationFn: postBroadcastedInterview,
  });
};

export const useGetBroadcastedInterviewSentRequests = () => {
  return useQuery({
    queryKey: ["sent-broadcasted-requests"],
    queryFn: getBroadcastedInterviewSentRequests,
  });
};

export const useGetBroadcastedInterviewRequest = (requestId: string) => {
  return useQuery({
    queryKey: ["broadcasted-request"],
    queryFn: () => getBroadcastedInterviewRequest(requestId),
  });
};

export const useGetBroadcastedInterviewReceivedRequests = () => {
  return useQuery({
    queryKey: ["received-broadcasted-requests"],
    queryFn: getBroadcastedInterviewReceivedRequests,
  });
};

export const useApplyToBroadcastedInterview = () => {
  return useMutation({
    mutationKey: ["apply-to-broadcasted-interview"],
    mutationFn: applyToBroadcastedInterview,
  });
};

export const useAcceptBroadcastedInterview = () => {
  return useMutation({
    mutationKey: ["accept-broadcasted-interview"],
    mutationFn: acceptBroadcastedInterview,
  });
};
