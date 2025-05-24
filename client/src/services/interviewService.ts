import { api } from "@/lib/api";
import { InterviewRequest, IUser, RequestedAsType } from "@/types";

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

export const requestPeerToPeerInterview = async ({
  interviewData,
}: {
  interviewData: {
    otherUserId: string;
    role: string;
    availability: Date[];
    requestType: RequestedAsType;
  };
}): Promise<InterviewRequest> => {
  try {
    const { otherUserId, role, availability, requestType } = interviewData;

    const response = await api.post(
      `/interview/request/peer-to-peer/${otherUserId}`,
      { role, availability, requestType }
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const acceptPeerToPeerInterview = async ({
  interviewRequestId,
  selectedSlot,
}: {
  interviewRequestId: string;
  selectedSlot: Date;
}): Promise<InterviewRequest> => {
  console.log({ selectedSlot });
  try {
    const response = await api.post(
      `interview/request/peer-to-peer/accept/${interviewRequestId}`,
      { selectedSlot }
    );
    console.log({ response });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getPeerToPeerInterviewSentRequests = async (): Promise<
  InterviewRequest[]
> => {
  try {
    const response = await api.get("/interview/request/peer-to-peer/sent");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getPeerToPeerInterviewSentRequest = async (
  requestId: string
): Promise<InterviewRequest> => {
  try {
    const response = await api.get(
      `/interview/request/peer-to-peer/${requestId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getPeerToPeerInterviewReceivedRequests = async (): Promise<
  InterviewRequest[]
> => {
  try {
    const response = await api.get("/interview/request/peer-to-peer/received");
    console.log({ response });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
