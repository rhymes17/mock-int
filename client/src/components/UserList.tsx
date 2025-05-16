import { useGetInterviewees, useGetInterviewers } from "@/hooks/useInterview";
import { CtaType, IUser, RequestedAsType } from "@/types";
import UserCard from "./UserCard";

const UserList = ({
  requestedAs,
  ctaType,
}: {
  requestedAs: RequestedAsType;
  ctaType: CtaType;
}) => {
  // If requesting as an interviewee than list all the valid interviewers and vice-versa
  const queryFn =
    requestedAs === "interviewee" ? useGetInterviewers : useGetInterviewees;
  const { data: userData, isLoading, error } = queryFn();

  if (isLoading) {
    return <h1>Loading....</h1>;
  }

  if (error || !userData) {
    return <div>Error...</div>;
  }

  return (
    <div className="grid grid-cols-4 gap-5 h-full">
      {userData.map((user: IUser) => (
        <UserCard
          key={user._id}
          user={user}
          requestedAs={requestedAs}
          ctaType={ctaType}
        />
      ))}
    </div>
  );
};

export default UserList;
