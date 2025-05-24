import { api } from "@/lib/api";
import { IUser } from "@/types";

export const getInterviewers = async (): Promise<IUser[]> => {
  try {
    const response = await api.get("/interview/list-interviewers");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getInterviewees = async (): Promise<IUser[]> => {
  try {
    const response = await api.get("/interview/list-candidates");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
