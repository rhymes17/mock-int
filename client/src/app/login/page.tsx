"use client";

import React from "react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function Login() {
  const handleLogin = () => {
    const redirectURI = `${BACKEND_URL}/api/auth/login`;
    window.location.href = redirectURI;
  };

  return (
    <div className="flex items-center justify-center h-[100svh]">
      <div className="bg-[#FFFFFD] border border-white/20 px-4 py-8 rounded-xl shadow-2xs min-h-[30%] w-[40vw] flex flex-col items-center gap-5">
        <div className="">
          <h1 className="text-2xl font-bold">MockInt</h1>
        </div>

        <button
          onClick={handleLogin}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
