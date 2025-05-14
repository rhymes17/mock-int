import { api } from "@/lib/api";

export const getLoggedInUser = async () => {
  try {
    const response = await api.get("/user/me");
    console.log({ response });
    return response.data.data;
  } catch (error: any) {
    console.log({ error });
    throw new Error(error.response.data.message);
  }
};
