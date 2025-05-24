import { api } from "@/lib/api";
import { BroadcastedInterviewRequest } from "@/types";

export const postBroadcastedInterview = async ({
  interviewData,
}: {
  interviewData: {
    role: string;
    availability: Date[];
  };
}): Promise<BroadcastedInterviewRequest> => {
  try {
    const { role, availability } = interviewData;

    const response = await api.post(`/interview/request/broadcasted`, {
      role,
      availability,
    });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const applyToBroadcastedInterview = async ({
  broadcastedInterviewId,
  selectedSlot,
}: {
  broadcastedInterviewId: string;
  selectedSlot: Date;
}): Promise<BroadcastedInterviewRequest> => {
  console.log({ selectedSlot });
  try {
    const response = await api.post(
      `/interview/request/broadcasted/${broadcastedInterviewId}`,
      {
        selectedSlot,
      }
    );
    console.log({ response });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const acceptBroadcastedInterview = async ({
  interviewRequestId,
  request,
}: {
  interviewRequestId: string;
  request: {
    user: string;
    selectedSlot: Date;
  };
}): Promise<BroadcastedInterviewRequest> => {
  try {
    const response = await api.post(
      `/interview/request/broadcasted/accept/${interviewRequestId}`,
      { request }
    );
    console.log({ response });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getBroadcastedInterviewSentRequests = async (): Promise<
  BroadcastedInterviewRequest[]
> => {
  try {
    const response = await api.get("/interview/request/broadcasted/sent");
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getBroadcastedInterviewRequest = async (
  interviewRequestId: string
): Promise<BroadcastedInterviewRequest> => {
  try {
    const response = await api.get(
      `/interview/request/broadcasted/${interviewRequestId}`
    );
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getBroadcastedInterviewReceivedRequests = async (): Promise<
  BroadcastedInterviewRequest[]
> => {
  try {
    const response = await api.get("/interview/request/broadcasted/received");
    console.log({ response });
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
