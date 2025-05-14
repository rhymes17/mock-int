import { getLoggedInUser } from "@/services/userServices";
import { useQuery } from "@tanstack/react-query";

export const useLoggedInUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getLoggedInUser,
    retry: 0,
  });
};
