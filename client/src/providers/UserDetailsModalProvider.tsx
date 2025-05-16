"use client";

import { CtaType, IUser, RequestedAsType } from "@/types";
import { createContext, useContext, useState } from "react";

interface IUserDetailsModalContext {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  ctaType: CtaType;
  setCtaType: React.Dispatch<React.SetStateAction<CtaType>>;
  requestedAs: RequestedAsType;
  setRequestedAs: React.Dispatch<React.SetStateAction<RequestedAsType>>;
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDetailsModalContext = createContext<
  IUserDetailsModalContext | undefined
>(undefined);

export const UserDetailsModalProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [ctaType, setCtaType] = useState<CtaType>("request");
  const [requestedAs, setRequestedAs] =
    useState<RequestedAsType>("interviewee");
  const [isModalVisible, setIsModalVisible] = useState(false);

  return (
    <UserDetailsModalContext.Provider
      value={{
        user,
        setUser,
        ctaType,
        setCtaType,
        requestedAs,
        setRequestedAs,
        isModalVisible,
        setIsModalVisible,
      }}
    >
      {children}
    </UserDetailsModalContext.Provider>
  );
};

export const useUserDetailsModal = () => {
  const context = useContext(UserDetailsModalContext);
  if (!context) {
    throw new Error(
      "useUserDetailsModal can only be used by UserDetailsModalProvider"
    );
  }

  return context;
};
