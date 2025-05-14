"use client";

import { useLoggedInUser } from "@/hooks/useUser";
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
  googleId?: string;
  email: string;
  name: string;
  avatar: string;
  accessToken?: string;
  refreshToken?: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id: string;
  profile: Profile;
}

interface IAuthContext {
  user: IUser | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const { data: loggedInUser, error } = useLoggedInUser();

  useEffect(() => {
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
    } else if (error) {
      setUser(null);
      setIsAuthenticated(true);
    }
  }, [loggedInUser, error]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
