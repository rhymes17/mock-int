import mongoose from "mongoose";
import { UserType } from "./User";

export interface IBroadcastedInterviewRequest {
  role: string;
  availability: Date[];
  interviewer: UserType;
  requests: { user: UserType; selectedSlot: Date }[];
  isAccepted: boolean;
  isWithdrawn: boolean;
}

const interviewRequest = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    selectedSlot: {
      type: Date,
      required: true,
    },
  },
  { _id: false }
);

const broadcastedInterviewRequestSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },
    availability: [
      {
        type: Date,
        required: true,
        validate: {
          validator: (val: Date) => val > new Date(),
          message: "Availability must be in the future.",
        },
      },
    ],
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    requests: {
      type: [interviewRequest],
      default: [],
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
