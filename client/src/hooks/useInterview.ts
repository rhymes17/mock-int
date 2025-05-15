import { getInterviewees, getInterviewers } from "@/services/interviewService";
import { useQuery } from "@tanstack/react-query";

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
