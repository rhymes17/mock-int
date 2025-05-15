import { IUser } from "@/types";
import { UseQueryResult } from "@tanstack/react-query";
import Image from "next/image";
import UserCard from "./UserCard";

const UserList = ({
  queryFn,
}: {
  queryFn: () => UseQueryResult<IUser[], Error>;
}) => {
  const { data: userData, isLoading, isError, error } = queryFn();

  if (isLoading) {
    return <h1>Loading....</h1>;
  }

  if (error || !userData) {
    return <div>Error...</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-5 h-full">
      {userData.map((user: IUser) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default UserList;
