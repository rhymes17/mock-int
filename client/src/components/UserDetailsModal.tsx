"use client";

import { useUserDetailsModal } from "@/providers/UserDetailsModalProvider";
import Image from "next/image";
import Button from "./Button";
import { CtaType, IUser, RequestedAsType } from "@/types";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRequestPeerToPeerInterview } from "@/hooks/useInterview";

const UserDetailsModal = () => {
  const { user, requestedAs, ctaType, setIsModalVisible, isModalVisible } =
    useUserDetailsModal();

  if (!isModalVisible || !user) return null;

  return (
    <div className="absolute bottom-0 h-[100%] w-[100%] bg-white/10 z-20 backdrop-blur-[3px] left-0 right-0 mx-auto border">
      <div
        onClick={() => setIsModalVisible(false)}
        className="text-3xl absolute right-5 top-5 cursor-pointer"
      >
        X
      </div>

      <div className="absolute bottom-2 h-[80%] w-[98%] left-0 right-0 mx-auto bg-white rounded-2xl p-8">
        <UserInformation
          user={user}
          requestedAs={requestedAs}
          ctaType={ctaType}
        />
      </div>
    </div>
  );
};

export default UserDetailsModal;

const UserInformation = ({
  user,
  requestedAs,
  ctaType,
}: {
  user: IUser;
  requestedAs: RequestedAsType;
  ctaType: CtaType;
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
        <RequestAnInterview
          otherUserId={user._id}
          requestedAs={requestedAs}
          ctaType={ctaType}
        />
      </div>
    </div>
  );
};

const RequestAnInterview = ({
  otherUserId,
  requestedAs,
  ctaType,
}: {
  otherUserId: string;
  requestedAs: RequestedAsType;
  ctaType: CtaType;
}) => {
  const [role, setRole] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const requestPeerToPeerInterviewMutation = useRequestPeerToPeerInterview();

  const handleCta = () => {
    if (!role || !selectedDate || !otherUserId) {
      console.log({ role, selectedDate, otherUserId });
      return;
    }

    requestPeerToPeerInterviewMutation.mutate({
      interviewData: {
        otherUserId,
        role,
        time: selectedDate,
        requestType: requestedAs,
      },
    });
  };

  useEffect(() => {
    if (requestPeerToPeerInterviewMutation.isError) {
      setErrorMessage(requestPeerToPeerInterviewMutation.error.message);
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    } else if (requestPeerToPeerInterviewMutation.isSuccess) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    }
    setSelectedDate(new Date());
    setRole("");
  }, [
    requestPeerToPeerInterviewMutation.isError,
    requestPeerToPeerInterviewMutation.isSuccess,
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

        <DateTimePicker
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
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
              !selectedDate ||
              requestPeerToPeerInterviewMutation.isPending ||
              !!errorMessage
            }
            isLoading={requestPeerToPeerInterviewMutation.isPending}
            title="Request an Interview"
            handleClick={handleCta}
          />
        )}
      </div>
    </div>
  );
};

const DateTimePicker = ({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date | null;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date | null>>;
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
