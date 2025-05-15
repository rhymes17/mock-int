"use client";

import { useLoggedInUser, useLogoutUser } from "@/hooks/useUser";
import { IUser } from "@/types";
import { createContext, useContext, useEffect, useState } from "react";

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: loggedInUser, error } = useLoggedInUser();
  const logoutMutation = useLogoutUser();

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } else if (error) {
      setUser(null);
      setIsAuthenticated(true);
    }
  }, [loggedInUser, error]);

  const logout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => {
        setUser(null);
      },
      onError: (err: any) => {
        console.error("Logout failed:", err);
      },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth can only be used by AuthProvider");
  }

  return context;
};
