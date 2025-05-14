"use client";

import { useAuth } from "@/providers/AuthProvider";
import { redirect } from "next/navigation";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <h1>Authenticating...</h1>;
  }

  if (!user) {
    redirect("/login");
  }

  return children;
};

export default ProtectedRoute;
