import { Request, Response } from "express";
import mongoose from "mongoose";
import User, { UserType } from "../Models/User";
import { asyncHandler } from "../utils/asyncHandler";

// @desc   Get logged in user
// @route  GET /api/user/me
// @access Private
const getLoggedInUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const userInfo = await User.findById(user._id)
    .select("-accessToken -refreshToken -googleId")
    .populate("profile.skills.skill")
    .exec();

  res
    .status(200)
    .json({ success: true, message: "User found", data: userInfo });
});

// @desc   Get user profile
// @route  GET /api/user/:id
// @access Public
const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  // Search for user in the DB
  const user = await User.findById(id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json({ success: true, message: "User found", data: user });
});

// @desc   Edit user profile
// @route  PUT /api/user/:id
// @access Private
const editUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const {
    linkedInUrl,
    bio,
    totalYoe,
    skills,
  }: {
    linkedInUrl: string;
    bio: string;
    totalYoe: number;
    skills: { id: string; yoe: number }[];
  } = req.body;
  const user = req.user as UserType;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const userDoc = await User.findById(user.id).select("-password");

  if (!userDoc) {
    throw new Error("User not found");
  }

  if (skills && skills.length > 0) {
    const exisitingSkills = new Set(
      userDoc.profile?.skills.map((s) => s.skill.toString())
    );
    const skillToAdd = skills
      .filter((skill) => !exisitingSkills.has(skill.id))
      .map((s) => ({ skill: new mongoose.Types.ObjectId(s.id), yoe: s.yoe }));
    if (skillToAdd.length > 0) userDoc.profile.skills.push(...skillToAdd);
  }

  if (linkedInUrl) {
    userDoc.profile.linkedInUrl = linkedInUrl;
  }

  if (bio) {
    userDoc.profile.bio = bio;
  }

  if (totalYoe) {
    userDoc.profile.totalYoe = totalYoe;
  }

  await userDoc.save();

  res.status(200).json({
    success: true,
    message: "User profile updated successfully",
    data: userDoc,
  });
});

export { editUserProfile, getUserProfile, getLoggedInUser };
