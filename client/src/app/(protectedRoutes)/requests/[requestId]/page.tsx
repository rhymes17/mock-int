"use client";

import { useGetPeerToPeerInterviewSentRequest } from "@/hooks/useInterview";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import { useParams } from "next/navigation";
import React from "react";

const InterviewRequest = () => {
  const { user } = useAuth();
  const { requestId } = useParams();
  const {
    data: interviewRequest,
    isLoading,
    isError,
  } = useGetPeerToPeerInterviewSentRequest(requestId as string);

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

  return (
    <div>
      <div className="flex flex-col gap-5">
        <div className="">
          <h1 className="text-3xl font-bold">{role}</h1>
          <div>
            {/* <h3>Date: {interviewDateAndTime.toDateString()}</h3>
            <h3>Time: {interviewDateAndTime.toLocaleTimeString()}</h3> */}
          </div>
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
      </div>
    </div>
  );
};

export default InterviewRequest;
