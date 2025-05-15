import { IUser } from "@/types";
import Image from "next/image";
import { useState } from "react";

const UserCard = ({ user }: { user: IUser }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  return (
    <div className="col-span-1 aspect-[4/3] border rounded-xl px-5 py-5 relative">
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
            className="h-[2rem] w-[2rem] aspect-square cursor-pointer relative"
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
          >
            <Image
              className="rounded-sm"
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

      <button className="absolute bottom-2 right-2 cursor-pointer rounded-lg px-4 py-2 bg-black text-white">
        Check Profile
      </button>
    </div>
  );
};

export default UserCard;
