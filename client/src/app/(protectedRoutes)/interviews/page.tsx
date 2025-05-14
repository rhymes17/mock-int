"use client";

import { useAuth } from "@/providers/AuthProvider";

const Interviews = () => {
  const { logout } = useAuth();

  return (
    <div>
      Interviews
      <h3 className="" onClick={logout}>
        Logout
      </h3>
    </div>
  );
};

export default Interviews;
