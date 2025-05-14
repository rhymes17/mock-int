"use client";

import { useLoggedInUser, useLogoutUser } from "@/hooks/useUser";
import { redirect } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface ISkill {
  name: string;
}

interface MySkill {
  skill: ISkill;
  yoe: number;
}

interface Profile {
  totalYoe: number;
  skills: MySkill[];
  linkedInUrl?: string;
  bio?: string;
}

interface IUser {
  email: string;
  name: string;
  avatar: string;
  _id: string;
  profile: Profile;
}

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const CACHED_USER = "cached_user";

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
