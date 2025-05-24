"use client";

import InterviewRequestList from "@/components/InterviewRequestList";
import { useState } from "react";

const InterviewRequests = () => {
  const [requestDirection, setRequestDirection] = useState<"sent" | "received">(
    "received"
  );
  const [requestType, setRequestType] = useState<
    "peer-to-peer" | "broadcasted"
  >("peer-to-peer");

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-[600]">Interview Requests</h1>

        <div className="flex items-center gap-8">
          <div className="flex items-center">
            <div
              onClick={() => setRequestType("peer-to-peer")}
              className={`py-2 border w-[9rem] border-black rounded-l-2xl text-center cursor-pointer ${
                requestType === "peer-to-peer"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              Peer To Peer
            </div>
            <div
              onClick={() => setRequestType("broadcasted")}
              className={`py-2 w-[9rem] border border-black border-l-transparent rounded-r-2xl text-center cursor-pointer ${
                requestType === "broadcasted"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              Broadcasted
            </div>
          </div>
          <div className="flex items-center">
            <div
              onClick={() => setRequestDirection("sent")}
              className={`py-2 border w-[7rem] border-black rounded-l-2xl text-center cursor-pointer ${
                requestDirection === "sent"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              Sent
            </div>
            <div
              onClick={() => setRequestDirection("received")}
              className={`py-2 w-[7rem] border border-black border-l-transparent rounded-r-2xl text-center cursor-pointer ${
                requestDirection === "received"
                  ? "bg-black text-white"
                  : "bg-white text-black"
              }`}
            >
              Received
            </div>
          </div>
        </div>
      </div>

      <div className="h-full mt-5">
        <InterviewRequestList
          requestType={requestType}
          requestDirection={requestDirection}
        />
      </div>
    </div>
  );
};

export default InterviewRequests;
