"use client";

import InterviewRequestList from "@/components/InterviewRequestList";
import React, { useState } from "react";

const InterviewRequests = () => {
  const [requestType, setRequestType] = useState<"sent" | "received">("sent");

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-[600]">Interview Requests</h1>

        <div className="flex items-center">
          <div
            onClick={() => setRequestType("sent")}
            className={`py-2 border w-[7rem] border-black rounded-l-2xl text-center cursor-pointer ${
              requestType === "sent"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Sent
          </div>
          <div
            onClick={() => setRequestType("received")}
            className={`py-2 w-[7rem] border border-black border-l-transparent rounded-r-2xl text-center cursor-pointer ${
              requestType === "received"
                ? "bg-black text-white"
                : "bg-white text-black"
            }`}
          >
            Received
          </div>
        </div>
      </div>

      <div className="h-full mt-5">
        <InterviewRequestList requestType={requestType}/>
      </div>
    </div>
  );
};

export default InterviewRequests;
