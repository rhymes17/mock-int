"use client";

import { useUserDetailsModal } from "@/providers/UserDetailsModalProvider";
import Image from "next/image";
import Button from "./Button";
import { CtaType, InterviewRequest, IUser, RequestedAsType } from "@/types";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import BottomSheet from "./BottomSheet";
import Modal from "./Modal";
import Scheduler from "./Scheduler";
import {
  useAcceptPeerToPeerInterview,
  useRequestPeerToPeerInterview,
} from "@/hooks/usePeerToPeerInterviewRequests";

const UserDetailsModal = () => {
  const {
    user,
    requestedAs,
    ctaType,
    setIsModalVisible,
    isModalVisible,
    interviewRequest,
  } = useUserDetailsModal();

  if (!isModalVisible || !user) return null;

  return (
    <BottomSheet
      isBottomSheetVisible={isModalVisible}
      setIsBottomSheetVisible={setIsModalVisible}
    >
      <UserInformation
        user={user}
        requestedAs={requestedAs}
        ctaType={ctaType}
        interviewRequest={
          ctaType === "accept" && !!interviewRequest
            ? interviewRequest
            : undefined
        }
      />
    </BottomSheet>
  );
};

export default UserDetailsModal;

const UserInformation = ({
  user,
  requestedAs,
  ctaType,
  interviewRequest,
}: {
  user: IUser;
  requestedAs: RequestedAsType;
  ctaType: CtaType;
  interviewRequest?: InterviewRequest;
}) => {
  return (
    <div className="grid grid-cols-4 grid-rows-4 h-full gap-x-5 gap-y-3">
      <div className="col-span-2 row-span-4 bg-amber-500 rounded-xl border p-5 relative">
        <div className="flex gap-5 items-center">
          <div className="h-[3rem] w-[3rem] rounded-full">
            <Image
              className="rounded-full"
              src={user.avatar}
              height={100}
              width={100}
              alt="user profile pic"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="">{user.name}</h1>
            <p className="text-black/70 text-xs">
              Total Years Of Experience:{" "}
              <span>
                {user.profile.totalYoe < 1 ? "<1" : user.profile.totalYoe}
              </span>{" "}
              years
            </p>
          </div>
        </div>

        <div className="">Personal Information </div>

        <div>Projects -- with brief</div>

        <div className="">Skills -- same format</div>
      </div>
      <div className="col-span-2 row-span-2 bg-amber-500 rounded-xl border p-5">
        Experience
      </div>
      <div className="col-span-2 row-span-2 rounded-xl p-5 shadow-xl ">
        <ScheduleInterview
          otherUserId={user._id}
          requestedAs={requestedAs}
          ctaType={ctaType}
          interviewRequest={interviewRequest}
        />
      </div>
    </div>
  );
};

const ScheduleInterview = ({
  otherUserId,
  requestedAs,
  ctaType,
  interviewRequest,
}: {
  otherUserId: string;
  requestedAs: RequestedAsType;
  ctaType: CtaType;
  interviewRequest?: InterviewRequest;
}) => {
  if (ctaType === "accept" && !interviewRequest)
    return <h1>No interview request selected </h1>;

  const [role, setRole] = useState(
    !!interviewRequest ? interviewRequest.role : ""
  );

  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);

  const [selectedTimeSlotsAsIsoString, setSelectedTimeSlotsAsIsoString] =
    useState<Date[]>([]);

  const requestPeerToPeerInterviewMutation = useRequestPeerToPeerInterview();
  const acceptPeerToPeerInterviewMutation = useAcceptPeerToPeerInterview();

  const selectedMutation =
    ctaType === "accept"
      ? acceptPeerToPeerInterviewMutation
      : requestPeerToPeerInterviewMutation;

  const handleCta = () => {
    if (ctaType === "request") {
      if (!role || selectedTimeSlotsAsIsoString.length === 0 || !otherUserId) {
        return;
      }
      requestPeerToPeerInterviewMutation.mutate({
        interviewData: {
          otherUserId,
          role,
          availability: selectedTimeSlotsAsIsoString,
          requestType: requestedAs,
        },
      });
    } else {
      if (!interviewRequest) {
        return;
      }
      acceptPeerToPeerInterviewMutation.mutate({
        interviewRequestId: interviewRequest._id,
        selectedSlot: new Date(),
      });
    }
  };

  useEffect(() => {
    if (selectedMutation.isError) {
      setErrorMessage(selectedMutation.error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
      if (ctaType === "request") {
        setRole("");
      }
    } else if (selectedMutation.isSuccess) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
      if (ctaType === "request") {
        setRole("");
      }
    }
  }, [selectedMutation.isError, selectedMutation.isSuccess]);

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
            disabled={!!interviewRequest}
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
              selectedMutation.isPending ||
              !!errorMessage ||
              interviewRequest?.isAccepted ||
              interviewRequest?.isRejected ||
              interviewRequest?.isWithdrawn
            }
            isLoading={selectedMutation.isPending}
            title={
              ctaType === "request"
                ? "Request an Interview"
                : "Accept Inteview Request"
            }
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

const DateTimePicker = ({
  selectedDate,
  setSelectedDate,
  disabled,
}: {
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
  disabled?: boolean;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="datetime" className=" font-medium text-gray-700">
        Select Date & Time
      </label>
      <DatePicker
        id="datetime"
        selected={selectedDate}
        onChange={(date) => setSelectedDate(date)}
        showTimeSelect
        disabled={disabled}
        dateFormat="Pp"
        className="w-full border border-gray-300 rounded-md p-2"
      />
    </div>
  );
};

//  Commented out
// const TimelineComponent = ({
//   firstStep,
//   viewType,
// }: {
//   firstStep: string;
//   viewType: ViewType;
// }) => {
//   return (
//     <div className="absolute top-10 left-0 right-0 mx-auto w-[30%] bg-black/30 py-2 rounded-xl flex justify-center gap-8">
//       <div className="flex flex-col gap-2 items-center justify-center">
//         <div
//           className={`h-[2rem] w-[2rem] rounded-full ${
//             viewType === "userInformation"
//               ? "bg-black text-white"
//               : "bg-white text-black"
//           } flex justify-center items-center`}
//         >
//           <p>1</p>
//         </div>
//         <h2 className="">{firstStep}</h2>
//       </div>
//       <div className="flex flex-col gap-2 items-center justify-center">
//         <div
//           className={`h-[2rem] w-[2rem] rounded-full ${
//             viewType === "scheduleInterview"
//               ? "bg-black text-white"
//               : "bg-white text-black"
//           } flex justify-center items-center`}
//         >
//           <p>2</p>
//         </div>
//         <h2 className="">Schedule Interview</h2>
//       </div>
//     </div>
//   );
// };
