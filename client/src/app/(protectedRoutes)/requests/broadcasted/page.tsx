"use client";

import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Scheduler from "@/components/Scheduler";
import { usePostBroadcastedInterview } from "@/hooks/useBroadcastedInterviewRequests";
import React, { useEffect, useState } from "react";

const PostBroadcastedInterview = () => {
  const [role, setRole] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const [selectedTimeSlotsAsIsoString, setSelectedTimeSlotsAsIsoString] =
    useState<Date[]>([]);

  const postBroadcastedInterviewMutation = usePostBroadcastedInterview();

  const handleCta = () => {
    if (!role || selectedTimeSlotsAsIsoString.length === 0) {
      return;
    }
    postBroadcastedInterviewMutation.mutate({
      interviewData: {
        role,
        availability: selectedTimeSlotsAsIsoString,
      },
    });
  };

  useEffect(() => {
    if (postBroadcastedInterviewMutation.isError) {
      setErrorMessage(postBroadcastedInterviewMutation.error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } else if (postBroadcastedInterviewMutation.isSuccess) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
  }, [
    postBroadcastedInterviewMutation.isError,
    postBroadcastedInterviewMutation.isSuccess,
  ]);

  return (
    <div className="relative h-full">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label htmlFor="role" className="t font-medium text-gray-700">
            Role :
          </label>
          <input
            id="role"
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className=" w-[50%] py-2 px-3 rounded-xl bg-yellow-100 outline-none shadow-xs"
          />
        </div>

        <Button
          title="Set Availibility"
          handleClick={() => setIsSchedulerOpen(true)}
        />
      </div>

      <div className="absolute bottom-2 right-2 flex gap-5 items-center">
        {errorMessage && <div className="text-red-500">{errorMessage}</div>}
        {isSuccess ? (
          <button
            className={`rounded-lg px-4 py-2 bg-green-500
             text-white`}
          >
            Success
          </button>
        ) : (
          <Button
            disabled={
              !role ||
              selectedTimeSlotsAsIsoString.length === 0 ||
              postBroadcastedInterviewMutation.isPending ||
              !!errorMessage
            }
            isLoading={postBroadcastedInterviewMutation.isPending}
            title="Post an Interview Request"
            handleClick={handleCta}
          />
        )}
      </div>
      <Modal isModalOpen={isSchedulerOpen} setIsModalOpen={setIsSchedulerOpen}>
        <Scheduler
          setIsSchedulerOpen={setIsSchedulerOpen}
          setSelectedTimeSlotsAsIsoString={setSelectedTimeSlotsAsIsoString}
        />
      </Modal>
    </div>
  );
};

export default PostBroadcastedInterview;
