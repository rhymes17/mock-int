"use client";

import UserList from "@/components/UserList";
import { useGetInterviewees, useGetInterviewers } from "@/hooks/useInterview";
import { useState } from "react";

const Interviews = () => {
  const [selectedCategory, setSelectedCategory] = useState<
    "interviewer" | "interviewee"
  >("interviewer");

  return (
    <div className="w-full">
      <div className="h-[4rem] w-[40%] mx-auto border rounded-xl flex items-center justify-center gap-5">
        <h3
          className={`text-2xl cursor-pointer ${
            selectedCategory === "interviewer"
              ? "border-blue-400"
              : "border-transparent"
          } border-b`}
          onClick={() => setSelectedCategory("interviewer")}
        >
          Find Interviewer
        </h3>
        <h3 className="text-2xl">|</h3>
        <h3
          className={`text-2xl cursor-pointer ${
            selectedCategory === "interviewee"
              ? "border-blue-400"
              : "border-transparent"
          } border-b`}
          onClick={() => setSelectedCategory("interviewee")}
        >
          Find Interviewer
        </h3>
      </div>

      <div className="h-full mt-5">
        {selectedCategory === "interviewee" ? (
          <UserList queryFn={useGetInterviewees} />
        ) : (
          <UserList queryFn={useGetInterviewers} />
        )}
      </div>
    </div>
  );
};

export default Interviews;
