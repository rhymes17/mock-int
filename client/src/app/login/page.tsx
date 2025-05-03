"use client";

import React from "react";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

export default function Login() {
  const handleLogin = () => {
    const redirectURI = `${BACKEND_URL}/api/auth/login`;
    window.location.href = redirectURI;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button
        onClick={handleLogin}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
