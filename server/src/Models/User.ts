import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
