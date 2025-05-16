export interface ISkill {
  name: string;
  logo: string;
}

export interface MySkill {
  _id: string;
  skill: ISkill;
  yoe: number;
}

export interface Profile {
  totalYoe: number;
  skills: MySkill[];
  linkedInUrl?: string;
  bio?: string;
}

export interface IUser {
  email: string;
  name: string;
  avatar: string;
  _id: string;
  profile: Profile;
}

export interface InterviewRequest {
  _id: string;
  role: string;
  time: Date;
  interviewer: IUser;
  interviewee: IUser;
  requestedBy: IUser;
  isAccepted: boolean;
  isRejected: boolean;
  isWithdrawn: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type CtaType = "request" | "accept";

export type RequestedAsType = "interviewer" | "interviewee";
