import { getLoggedInUser, logoutUser } from "@/services/userServices";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useLoggedInUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getLoggedInUser,
    retry: 0,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useLogoutUser = () => {
  return useMutation({
    mutationKey: ["user"],
    mutationFn: logoutUser,
  });
};
