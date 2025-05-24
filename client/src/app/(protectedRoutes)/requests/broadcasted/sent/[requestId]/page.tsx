"use client";

import Button from "@/components/Button";
import Card from "@/components/Card";
import {
  useAcceptBroadcastedInterview,
  useApplyToBroadcastedInterview,
  useGetBroadcastedInterviewRequest,
} from "@/hooks/useBroadcastedInterviewRequests";
import { useAuth } from "@/providers/AuthProvider";
import { IUser } from "@/types";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const BroadcastedInterviewRequest = () => {
  const { requestId } = useParams();
  const {
    data: interviewRequest,
    isLoading,
    isError,
    error,
  } = useGetBroadcastedInterviewRequest(requestId as string);

  const acceptBroadcastedInterview = useAcceptBroadcastedInterview();
  const [errMsg, setErrMsg] = useState("");
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (acceptBroadcastedInterview.isError) {
      setErrMsg("Failed to apply to interview");
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
    }
    if (acceptBroadcastedInterview.isSuccess) {
    }
  }, [
    acceptBroadcastedInterview.isPending,
    acceptBroadcastedInterview.isError,
    acceptBroadcastedInterview.isSuccess,
  ]);

  if (isError || !interviewRequest) {
    return <div>No interview found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { role, requests } = interviewRequest;

  const handleAcceptBroadcastedInterview = (request: {
    user: string;
    selectedSlot: Date;
  }) => {
    setIsAccepting(true);
    if (!requestId) {
      setErrMsg("No request selected");
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
      setIsAccepting(false);
      return;
    }
    setErrMsg("");
    acceptBroadcastedInterview.mutate({
      interviewRequestId: interviewRequest._id,
      request,
    });
    setIsAccepting(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="">
          <h1 className="text-3xl font-bold">{role}</h1>
        </div>

        <div className="flex flex-col rounded-xl mx-auto gap-8 w-[90%] shadow-2xl px-4 py-8">
          <div className="flex flex-wrap gap-4">
            {requests.map((request) => {
              const { _id, avatar, name, profile } = request.user;
              const date = new Date(request.selectedSlot).toLocaleString(
                undefined,
                {
                  dateStyle: "medium",
                  timeStyle: "short",
                }
              );
              return (
                <Card
                  buttonTitle={
                    interviewRequest.isAccepted ? "Scheduled already" : "Accept"
                  }
                  handleButtonClick={() => {
                    handleAcceptBroadcastedInterview({
                      user: _id,
                      selectedSlot: request.selectedSlot,
                    });
                  }}
                  buttonDisabled={
                    isAccepting ||
                    interviewRequest.isAccepted ||
                    interviewRequest.isWithdrawn
                  }
                >
                  <div>
                    <div className="flex gap-2 items-center">
                      <div className="h-[2rem] w-[2rem] rounded-full">
                        <Image
                          className="rounded-full"
                          src={avatar}
                          height={100}
                          width={100}
                          alt="user profile pic"
                        />
                      </div>
                      <div className="flex flex-col">
                        <h1 className="">{name}</h1>
                        <p className="text-black/70 text-xs">
                          Total Years Of Experience:{" "}
                          <span>
                            {profile.totalYoe < 1 ? "<1" : profile.totalYoe}
                          </span>{" "}
                          years
                        </p>
                      </div>
                    </div>

                    <div className="pt-5 flex flex-col gap-1">
                      <h1 className="text-lg">Time Slot: </h1>
                      <h2>{date}</h2>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          {errMsg && <h3 className="text-red-500 text-center">{errMsg}</h3>}
        </div>
      </div>
    </div>
  );
};

export default BroadcastedInterviewRequest;
