import mongoose, { Document, Types } from "mongoose";

interface MySkill {
  skill: Types.ObjectId;
  yoe: number; // years of experience
}

interface Experience {
  _id?: Types.ObjectId;
  companyName: string;
  role: string;
  from: Date;
  to: Date | null;
  currentlyWorking: boolean;
  techStack: Types.ObjectId[];
  description: string;
}

interface Project {
  _id?: Types.ObjectId;
  name: string;
  from: Date;
  to: Date;
  techStack: Types.ObjectId[];
  deployedProjectLink: string;
  githubRepoLink: string;
  description: string;
}

interface Profile {
  totalYoe: number;
  skills: MySkill[];
  linkedInUrl?: string;
  leetcodeUrl?: string;
  githubUrl?: string;
  experience: Experience[];
  projects: Project[];
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

const experienceSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
    },
    from: Date,
    to: Date,
    currentlyWorking: Boolean,
    techStack: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    description: String,
  },
  {
    timestamps: true,
  }
);

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    from: Date,
    to: Date,
    techStack: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Skill",
      },
    ],
    description: String,
    deployedProjectLink: String,
    githubRepoLink: String,
  },
  {
    timestamps: true,
  }
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
    leetcodeUrl: {
      type: String,
    },
    githubUrl: {
      type: String,
    },
    experience: [experienceSchema],
    projects: [projectSchema],
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
