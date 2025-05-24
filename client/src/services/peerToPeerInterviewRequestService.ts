import { api } from "@/lib/api";
import { PeerToPeerInterviewRequest, RequestedAsType } from "@/types";

export const requestPeerToPeerInterview = async ({
  interviewData,
}: {
  interviewData: {
    otherUserId: string;
    role: string;
    availability: Date[];
    requestType: RequestedAsType;
  };
}): Promise<PeerToPeerInterviewRequest> => {
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
}): Promise<PeerToPeerInterviewRequest> => {
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
  PeerToPeerInterviewRequest[]
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
): Promise<PeerToPeerInterviewRequest> => {
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
  PeerToPeerInterviewRequest[]
> => {
  try {
    const response = await api.get("/interview/request/peer-to-peer/received");
    console.log({ response });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
