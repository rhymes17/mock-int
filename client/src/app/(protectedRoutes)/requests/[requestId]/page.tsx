"use client";

import Button from "@/components/Button";
import {
  useAcceptPeerToPeerInterview,
  useGetPeerToPeerInterviewSentRequest,
} from "@/hooks/usePeerToPeerInterviewRequests";

import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const InterviewRequest = () => {
  const { user } = useAuth();
  const { requestId } = useParams();
  const {
    data: interviewRequest,
    isLoading,
    isError,
    error,
  } = useGetPeerToPeerInterviewSentRequest(requestId as string);

  const acceptPeerToPeerInterviewMutation = useAcceptPeerToPeerInterview();
  const [selectedSlot, setSelectedSlot] = useState<Date | null>(null);
  const [errMsg, setErrMsg] = useState("");
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (acceptPeerToPeerInterviewMutation.isError) {
      setErrMsg("Failed to accept interview");
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
    }
    if (acceptPeerToPeerInterviewMutation.isSuccess) {
      setSelectedSlot(null);
    }
  }, [
    acceptPeerToPeerInterviewMutation.isPending,
    acceptPeerToPeerInterviewMutation.isError,
    acceptPeerToPeerInterviewMutation.isSuccess,
  ]);

  if (isError || !interviewRequest) {
    return <div>No interview found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const { role, availability, interviewee, interviewer } = interviewRequest;
  // const interviewDateAndTime = new Date(time);
  console.log({ availability });

  const otherParty =
    interviewee.email === user?.email ? interviewer : interviewee;

  const userRole =
    interviewee.email === user?.email ? "Interviewee" : "Interviewer";

  const handleAcceptPeerToPeerInterviewRequest = () => {
    setIsAccepting(true);
    if (!selectedSlot) {
      setErrMsg("No slot selected");
      setTimeout(() => {
        setErrMsg("");
      }, 3000);
      setIsAccepting(false);
      return;
    }
    setErrMsg("");
    acceptPeerToPeerInterviewMutation.mutate({
      interviewRequestId: interviewRequest._id,
      selectedSlot: selectedSlot,
    });
    setIsAccepting(false);
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
            <div className="h-[2rem] w-[2rem] rounded-full">
              <Image
                src={otherParty.avatar}
                alt="other party profile picture"
                height={100}
                width={100}
                className="rounded-full border border-white"
              />
            </div>
            <h3>{otherParty.name}</h3>
          </div>
          <h2 className="">
            requested an interview with you and has invited you to be an{" "}
            <span className="underline">{userRole}</span>
          </h2>
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
            isLoading={isAccepting}
            title="Accept Request"
            handleClick={handleAcceptPeerToPeerInterviewRequest}
          />
          {errMsg && <h3 className="text-red-500 text-center">{errMsg}</h3>}
        </div>
      </div>
    </div>
  );
};

export default InterviewRequest;
