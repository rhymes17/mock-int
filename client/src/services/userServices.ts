import { api } from "@/lib/api";

export const getLoggedInUser = async () => {
  try {
    const response = await api.get("/user/me");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post("/auth/logout");
    console.log({ response });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
