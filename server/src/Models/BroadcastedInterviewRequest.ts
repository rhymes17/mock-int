import mongoose from "mongoose";
import { UserType } from "./User";

export interface IBroadcastedInterviewRequest {
  role: string;
  time: Date;
  interviewer: UserType;
  interestedInterviewees: UserType[];
  isAccepted: boolean;
  isWithdrawn: boolean;
}

const broadcastedInterviewRequestSchema = new mongoose.Schema(
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
    interestedInterviewees: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    isAccepted: {
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

const BroadcastedInterviewRequest = mongoose.model(
  "BroadcastedInterviewRequest",
  broadcastedInterviewRequestSchema
);

export default BroadcastedInterviewRequest;
