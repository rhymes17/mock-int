"use client";

import { useAuth } from "@/providers/AuthProvider";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      redirect("/dashboard");
    }
  }, [isAuthenticated, user]);
  return children;
}
