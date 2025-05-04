import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import User, { UserType } from "../Models/User";
import mongoose from "mongoose";

// @desc   List all eligible interviewees for a user
// @route  GET /api/interview/list-candidates
// @access Private
const listEligibleInterviewees = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const users = await User.find();

    res.status(200).json({
      success: true,
      message: "Eligible candidated fetched successfully",
      data: users,
    });
  }
);

// @desc   List all eligible interviewers for a user
// @route  GET /api/interview/list-interviewers
// @access Private
const listEligibleInterviewers = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const users = await User.find();

    res.status(200).json({
      success: true,
      message: "Eligible interviewers fetched successfully",
      data: users,
    });
  }
);

export { listEligibleInterviewees, listEligibleInterviewers };
