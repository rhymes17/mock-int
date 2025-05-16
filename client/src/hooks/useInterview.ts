import {
  getInterviewees,
  getInterviewers,
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
    mutationKey: ["peer-to-peer-interview"],
    mutationFn: requestPeerToPeerInterview,
  });
};
