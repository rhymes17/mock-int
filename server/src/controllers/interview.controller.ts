import { Request, Response } from "express";
import { UserType } from "../Models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { getSafeUsers } from "../utils/mongoDbHelpers";

// @desc   Get all eligible interviewees for a user
// @route  GET /api/interview/list-candidates
// @access Private
const getEligibleInterviewees = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const users = (await getSafeUsers()).filter(
      (fetchedUser) => fetchedUser.email !== user.email
    );

    res.status(200).json({
      success: true,
      message: "Eligible candidated fetched successfully",
      data: users,
    });
  }
);

// @desc   Get all eligible interviewers for a user
// @route  GET /api/interview/list-interviewers
// @access Private
const getEligibleInterviewers = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const users = (await getSafeUsers()).filter(
      (fetchedUser) => fetchedUser.email !== user.email
    );

    res.status(200).json({
      success: true,
      message: "Eligible interviewers fetched successfully",
      data: users,
    });
  }
);

export { getEligibleInterviewees, getEligibleInterviewers };
