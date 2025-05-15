"use client";

import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-4 grid-rows-8 gap-x-8 gap-y-5">
      <div className="shadow-2xs rounded-xl bg-[#FFFFFD] col-span-2 row-span-3 py-5 px-8">
        <h3 className="text-2xl">Hello,</h3>
        <h1 className="text-3xl">{user?.name}</h1>
      </div>
      <div className="shadow-2xs rounded-xl bg-[#FFFFFD] col-span-2 row-span-4">
        All recent activities will go here
      </div>
      <div className="shadow-2xs rounded-xl bg-[#FFFFFD] col-span-2 row-span-5">
        All notifications type things will go here
      </div>
      <div className="shadow-2xs rounded-xl bg-[#FFFFFD] col-span-2 row-span-4 flex justify-center items-center gap-8">
        <Link href="/interviews">
          <button className=" px-8 py-5 text-xl bg-[#EF5907] text-white rounded-xl cursor-pointer">
            Find an interviewee
          </button>
        </Link>

        <Link href="/interviews">
          <button className=" px-8 py-5 text-xl bg-[#EF5907] text-white rounded-xl cursor-pointer">
            Find an interviewer
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
