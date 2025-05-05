import mongoose from "mongoose";
import { UserType } from "./User";

export interface IPeerToPeerInterviewRequest {
  role: string;
  time: Date;
  interviewer: UserType;
  interviewee: UserType;
  requestedBy: UserType;
  isAccepted: boolean;
  isRejected: boolean;
  isWithdrawn: boolean;
}

const peerToPeerInterviewRequestSchema = new mongoose.Schema(
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
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    isRejected: {
      type: Boolean,
      default: false,
    },
    isWithdrawn: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const PeerToPeerInterviewRequest = mongoose.model(
  "PeerToPeerInterviewRequest",
  peerToPeerInterviewRequestSchema
);

export default PeerToPeerInterviewRequest;
