"use client";

import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";
import Link from "next/link";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <h1>User not logged in</h1>;
  }

  return (
    <div className="grid grid-cols-2 grid-rows-2  h-[calc(100vh-8rem)] gap-5">
      <div className="col-span-1 row-span-2 bg-amber-50 h-full rounded-xl px-8 py-10">
        <div className="flex gap-2 justify-center flex-col items-center">
          <div className="h-[8rem] w-[8rem] flex justify-center items-center rounded-full">
            <Image
              className="rounded-full"
              src={user.avatar}
              height={130}
              width={130}
              alt="user profile pic"
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-3xl">{user.name}</h1>
            <h1 className="text-lg">{user.email}</h1>
          </div>

          <div className="flex items-center gap-3">
            <Link href={user.profile.linkedInUrl || ""}>
              <h1 className="underline text-md">LinkedIn</h1>
            </Link>
            <Link href={user.profile.leetcodeUrl || ""}>
              <h1 className="underline text-md">Leetcode</h1>
            </Link>{" "}
            <Link href={user.profile.githubUrl || ""}>
              <h1 className="underline text-md">Github</h1>
            </Link>
          </div>
        </div>

        <div className="">
          <h3 className="">{user.profile.bio}</h3>
        </div>

        <div className="">
          <h1 className="text-2xl">Skills</h1>
          {user.profile.skills.map((skill) => (
            <div
              key={skill._id}
              className="h-[5rem] w-[5rem] aspect-square cursor-pointer relative "
            >
              <Image
                className="rounded-sm "
                src={skill.skill.logo}
                height={100}
                width={100}
                alt={skill.skill.name}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-1 bg-amber-50 h-full rounded-xl px-8 py-10">
        <h1 className="text-xl">Projects</h1>
      </div>

      <div className="col-span-1 bg-amber-50 h-full rounded-xl px-8 py-10">
        <h1 className="text-xl">Experience</h1>
      </div>
    </div>
  );
};

export default Profile;
