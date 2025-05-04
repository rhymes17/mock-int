import mongoose, { Document, Types } from "mongoose";
import { ISkill } from "./Skill";

interface MySkill {
  skill: Types.ObjectId | ISkill;
  yoe: number; // years of experience
}

interface Profile {
  totalYoe: number;
  skills: MySkill[];
  linkedInUrl?: string;
  bio?: string;
}

export interface UserType extends Document {
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

const mySkillsSchema = new mongoose.Schema(
  {
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Skill",
      required: true,
    },
    yoe: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { _id: false }
);

const profileSchema = new mongoose.Schema<Profile>(
  {
    totalYoe: {
      type: Number,
      required: true,
      default: 0,
    },
    skills: [mySkillsSchema],
    linkedInUrl: {
      type: String,
    },
    bio: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema<UserType>(
  {
    googleId: String,
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    accessToken: String,
    refreshToken: String,
    profile: profileSchema,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
