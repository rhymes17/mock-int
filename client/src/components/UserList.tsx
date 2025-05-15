import { IUser } from "@/types";
import { UseQueryResult } from "@tanstack/react-query";

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
    <div className="flex flex-wrap gap-5 h-full">
      {userData.map((user: IUser) => (
        <div
          key={user._id}
          className="h-[18rem] w-[30%] border rounded-xl px-5 py-5"
        >
          <h1 className="">{user.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default UserList;
