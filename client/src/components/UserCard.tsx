import { useUserDetailsModal } from "@/providers/UserDetailsModalProvider";
import { CtaType, IUser, RequestedAsType } from "@/types";
import Image from "next/image";
import { useState } from "react";
import Button from "./Button";

const UserCard = ({
  user,
  requestedAs,
  ctaType,
}: {
  user: IUser;
  requestedAs: RequestedAsType;
  ctaType: CtaType;
}) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const { setUser, setCtaType, setRequestedAs, setIsModalVisible } =
    useUserDetailsModal();

  const handleClick = () => {
    setUser(user);
    setRequestedAs(requestedAs);
    setCtaType(ctaType);
    setIsModalVisible(true);
  };

  return (
    <div className="col-span-1 aspect-[4/3] shadow-lg rounded-xl px-5 py-5 relative bg-[#FFFFFD]/30 cursor-pointer">
      <div className="flex gap-2 items-center">
        <div className="h-[2rem] w-[2rem] rounded-full">
          <Image
            className="rounded-full"
            src={user.avatar}
            height={100}
            width={100}
            alt="user profile pic"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="">{user.name}</h1>
          <p className="text-black/70 text-xs">
            Total Years Of Experience:{" "}
            <span>
              {user.profile.totalYoe < 1 ? "<1" : user.profile.totalYoe}
            </span>{" "}
            years
          </p>
        </div>
      </div>

      <div className="pt-5 flex flex-col gap-1">
        <h1 className="text-lg">Skills</h1>
        {user.profile.skills.map((skill) => (
          <div
            key={skill._id}
            className="h-[2rem] w-[2rem] aspect-square cursor-pointer relative "
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
          >
            <Image
              className="rounded-sm "
              src={skill.skill.logo}
              height={100}
              width={100}
              alt={skill.skill.name}
            />

            {/* Todo: A production ready tooltip component */}
            {isTooltipVisible && (
              <div className="absolute w-[10rem] bg-[#FFFFFD] rounded-xl top-10 -left-12 px-5 py-2">
                <h2 className="text-lg border-b border-black/20 py-2  cursor-pointer">
                  Skill : {skill.skill.name}
                </h2>
                <h2 className="text-lg py-2  cursor-pointer">
                  YEO: {skill.yoe < 1 ? "<1" : skill.yoe}
                </h2>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-2 right-2">
        <Button title="Check Profile" handleClick={handleClick} />
      </div>
    </div>
  );
};

export default UserCard;
