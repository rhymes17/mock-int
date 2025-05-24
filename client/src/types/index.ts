export interface ISkill {
  name: string;
  logo: string;
}

export interface MySkill {
  _id: string;
  skill: ISkill;
  yoe: number;
}

export interface Experience {
  _id: string;
  companyName: string;
  role: string;
  from: Date;
  to: Date | null;
  currentlyWorking: boolean;
  techStack: string[];
  description: string;
}

export interface Project {
  _id: string;
  name: string;
  from: Date;
  to: Date;
  techStack: string[];
  deployedProjectLink: string;
  githubRepoLink: string;
  description: string;
}

export interface Profile {
  totalYoe: number;
  skills: MySkill[];
  linkedInUrl?: string;
  bio?: string;
  leetcodeUrl?: string;
  githubUrl?: string;
  experience: Experience[];
  projects: Project[];
}

export interface IUser {
  email: string;
  name: string;
  avatar: string;
  _id: string;
  profile: Profile;
}

export interface PeerToPeerInterviewRequest {
  _id: string;
  role: string;
  availability: Date[];
  interviewer: IUser;
  interviewee: IUser;
  requestedBy: IUser;
  isAccepted: boolean;
  isRejected: boolean;
  isWithdrawn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BroadcastedInterviewRequest {
  _id: string;
  role: string;
  availability: Date[];
  interviewer: IUser;
  requests: { user: IUser; selectedSlot: Date }[];
  isAccepted: boolean;
  isWithdrawn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CtaType = "request" | "accept";

export type RequestedAsType = "interviewer" | "interviewee";

export type SelectedTimeSlots = {
  [date: string]: Map<string, boolean>;
};

export type TimeSlot = {
  key: string;
  value: string;
};
