"use client";

import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <div className="h-[4rem] w-[80%] bg-black/20 rounded-xl fixed top-5 left-0 right-0 mx-auto backdrop-blur-lg px-5 justify-center flex items-center ">
      <div className="flex gap-6">
        <Link href="">
          <h3 className="text-xl">Home</h3>
        </Link>
        <Link href="">
          <h3 className="text-xl">Dashboard</h3>
        </Link>
        <Link href="">
          <h3 className="text-xl">Interviews</h3>
        </Link>
        <Link href="">
          <h3 className="text-xl">Profile</h3>
        </Link>
      </div>

      <div className="flex items-center gap-3 absolute top-1/2 -translate-y-1/2 right-5">
        <div className="flex flex-col items-end">
          <h1 className="">{user?.name}</h1>
          <p className="text-black/70">{user?.email}</p>
        </div>

        <div className="h-[2.7rem] w-[2.7rem] aspect-square rounded-full relative">
          <Image
            onClick={() => {
              setIsProfileModalOpen((prev) => !prev);
            }}
            className="border rounded-full cursor-pointer"
            src={user?.avatar}
            height={100}
            width={100}
            alt="user profile"
          />

          {isProfileModalOpen && (
            <div className="absolute  w-[10rem] bg-[#FFFFFD] rounded-xl top-13 -left-12 px-5 py-2">
              <h2 className="text-lg border-b border-black/20 py-2  cursor-pointer">
                Profile
              </h2>
              <h2 onClick={logout} className="text-lg py-2 cursor-pointer">
                Logout
              </h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
