import mongoose from "mongoose";
import { UserType } from "./User";

export interface Interview {
  role: string;
  time: Date;
  interviewer: UserType;
  interviewee: UserType;
  interviewLink: string;
  feedback: string;
}

const interviewSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    interviewLink: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

export default Interview;
