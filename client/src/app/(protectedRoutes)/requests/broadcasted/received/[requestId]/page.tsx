"use client";

import Button from "@/components/Button";
import {
  useApplyToBroadcastedInterview,
  useGetBroadcastedInterviewRequest,
} from "@/hooks/useBroadcastedInterviewRequests";
import { useAuth } from "@/providers/AuthProvider";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const ReceivedBroadcastedInterviewRequest = () => {
  const { user } = useAuth();
  const { requestId } = useParams();
  const {
    data: interviewRequest,
    isLoading,
    isError,
    error,
  } = useGetBroadcastedInterviewRequest(requestId as string);

  const applyToBroadcastedInterviewRequest = useApplyToBroadcastedInterview();
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    if (applyToBroadcastedInterviewRequest.isError) {
      setErrMsg("Failed to apply to interview");
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
    }
    if (applyToBroadcastedInterviewRequest.isSuccess) {
      setSelectedSlot(null);
    }
  }, [
    applyToBroadcastedInterviewRequest.isPending,
    applyToBroadcastedInterviewRequest.isError,
    applyToBroadcastedInterviewRequest.isSuccess,
  ]);

  if (isError || !interviewRequest) {
    return <div>No interview found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { role, availability, requests } = interviewRequest;

  const hasAlreadyApplied = !!requests.find(
    (request) => request.user._id === user?._id
  );

  const handleApplyToBroadcastedInterview = () => {
    setIsApplying(true);
    if (!selectedSlot) {
      setErrMsg("No slot selected");
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
      setIsApplying(false);
      return;
    }
    setErrMsg("");
    applyToBroadcastedInterviewRequest.mutate({
      broadcastedInterviewId: interviewRequest._id,
      selectedSlot: selectedSlot,
    });
    setIsApplying(false);
  };

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="">
          <h1 className="text-3xl font-bold">{role}</h1>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div
            onClick={() => {}}
            className="flex gap-2 items-center w-fit px-2 py-2 rounded-xl shadow-2xl cursor-pointer"
          >
            {requests.map((request) => (
              <div className="h-[2rem] w-[2rem] rounded-full">
                <Image
                  src={request.user.avatar}
                  alt="other party profile picture"
                  height={100}
                  width={100}
                  className="rounded-full border border-white"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col rounded-xl mx-auto gap-8 w-[70%] shadow-2xl px-4 py-8">
          <h1 className="text-center text-2xl font-bold">Select a slot</h1>
          <div className="flex flex-wrap gap-4">
            {availability.map((slot: Date) => {
              const date = new Date(slot).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              });
              return (
                <div
                  key={date}
                  onClick={() => setSelectedSlot(slot)}
                  className={`py-3 px-4 rounded-xl ${
                    selectedSlot === slot
                      ? "bg-black text-white"
                      : "bg-white text-black"
                  } shadow-xl cursor-pointer`}
                >
                  {date}
                </div>
              );
            })}
          </div>

          <Button
            isLoading={isApplying}
            disabled={hasAlreadyApplied}
            title={hasAlreadyApplied ? "Applied" : "Apply"}
            handleClick={handleApplyToBroadcastedInterview}
          />
          {errMsg && <h3 className="text-red-500 text-center">{errMsg}</h3>}
        </div>
      </div>
    </div>
  );
};

export default ReceivedBroadcastedInterviewRequest;
