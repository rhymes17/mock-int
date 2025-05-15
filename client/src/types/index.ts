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
