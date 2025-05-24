import User, { UserType } from "../Models/User";
import BroadcastedInterviewRequest, {
  IBroadcastedInterviewRequest,
} from "../Models/BroadcastedInterviewRequest";
import Interview from "../Models/Interview";
import { createGoogleMeetEvent } from "../utils/createGoogleMeetEvent";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";

// @desc   Get all received broadcasted interview requests
// @route  GET /api/interview/request/broadcasted/received
// @access Private
const getBroadcastedInterviewReceivedRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interviewRequests = await BroadcastedInterviewRequest.find({
      $and: [
        {
          interviewer: { $ne: user._id },
        },
      ],
    }).populate({
      path: "interviewer requests.user",
      select: "-accessToken -refreshToken -googleId",
    });

    res.status(200).json({
      success: true,
      message: "Interview requests fetched successfully",
      data: interviewRequests,
    });
  }
);

// @desc   Get all sent broadcasted interview requests
// @route  GET /api/interview/request/broadcasted/sent
// @access Private
const getBroadcastedInterviewSentRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interviewRequests = await BroadcastedInterviewRequest.find({
      interviewer: user._id,
    }).populate({
      path: "interviewer requests.user",
      select: "-accessToken -refreshToken -googleId",
    });

    res.status(200).json({
      success: true,
      message: "Interview requests fetched successfully",
      data: interviewRequests,
    });
  }
);

// @desc   Get a broadcasted interview request
// @route  GET /api/interview/request/broadcasted/:interviewRequestId
// @access Private
const getBroadcastedInterviewRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interviewRequestId = req.params.interviewRequestId;

    if (!interviewRequestId) {
      res.status(403);
      throw new Error("No interview id found!");
    }

    const interviewRequest = await BroadcastedInterviewRequest.findById(
      interviewRequestId
    ).populate({
      path: "interviewer requests.user",
      select: "-accessToken -refreshToken -googleId",
      populate: {
        path: "profile.skills.skill",
        model: "Skill",
      },
    });

    if (!interviewRequest) {
      res.status(404);
      throw new Error("No interview request found");
    }

    res.status(200).json({
      success: true,
      message: "Interview request fetched successfully",
      data: interviewRequest,
    });
  }
);

// @desc   Make broadcasted interview request
// @route  POST /api/interview/request/broadcasted
// @access Private
const requestBroadcastedInterview = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const {
      role,
      availability,
    }: {
      role: string;
      availability: Date[];
    } = req.body;

    if (availability.length === 0) {
      res.status(400);
      throw new Error("No availalibity set");
    }

    if (!role) {
      throw new Error("Role must be defined!");
    }

    let broadcastedInterviewRequest: IBroadcastedInterviewRequest = {
      role,
      availability,
      interviewer: user,
      requests: [],
      isAccepted: false,
      isWithdrawn: false,
    };

    const broadcastedInterviewRequestDoc =
      await BroadcastedInterviewRequest.create(broadcastedInterviewRequest);

    res.status(200).json({
      success: true,
      message: "Interview requested successfully",
      data: broadcastedInterviewRequestDoc,
    });
  }
);

// @desc   Apply to broadcasted interview
// @route  POST /api/interview/request/broadcasted/:broadcastedInterviewId
// @access Private
const applyToBroadcastedInterview = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const broadcastedInterviewId = req.params.broadcastedInterviewId;

    if (!broadcastedInterviewId) {
      res.status(403);
      throw new Error("No interview selected");
    }
    const { selectedSlot } = req.body;

    const broadcastedInterviewDoc = await BroadcastedInterviewRequest.findById(
      broadcastedInterviewId
    );

    if (!broadcastedInterviewDoc) {
      res.status(404);
      throw new Error("Interview request not found!");
    }

    if (user.id === broadcastedInterviewDoc.interviewer.toString()) {
      res.status(403);
      throw new Error("Interviewer cannot apply for an interview");
    }

    if (broadcastedInterviewDoc.isAccepted === true) {
      res.status(400);
      throw new Error("Interview Request is no longer available");
    }

    if (broadcastedInterviewDoc.isWithdrawn === true) {
      res.status(400);
      throw new Error("Interview Request is no longer available");
    }

    const request = {
      user: user.id,
      selectedSlot,
    };

    if (
      broadcastedInterviewDoc.requests.find(
        (request) => request.user.toString() === user._id
      )
    ) {
      res.status(400);
      throw new Error("Already applied to this interview");
    }

    broadcastedInterviewDoc.requests.push(request);

    await broadcastedInterviewDoc.save();

    res.status(200).json({
      success: true,
      message: "Applied to interview successfully",
      data: broadcastedInterviewDoc,
    });
  }
);

// @desc   Schedule a broadcasted interview request
// @route  POST /api/interview/request/broadcasted/accept/:interviewRequestId
// @access Private
const acceptBroadcastedInterviewRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interviewRequestId = req.params.interviewRequestId;

    if (!interviewRequestId) {
      res.status(403);
      throw new Error("No interview id found!");
    }

    const { request } = req.body;

    if (!request) {
      res.status(404);
      throw new Error("No request choosen");
    }

    const interviewRequest = await BroadcastedInterviewRequest.findOne({
      $and: [
        {
          $or: [{ interviewee: user._id }, { interviewer: user._id }],
        },
        {
          _id: interviewRequestId,
        },
      ],
    });

    if (!interviewRequest) {
      res.status(404);
      throw new Error("Interview request not found or inaccessible");
    }

    if (interviewRequest.isAccepted === true) {
      res.status(400);
      throw new Error("Interview already accepted");
    }

    if (interviewRequest.isWithdrawn === true) {
      res.status(400);
      throw new Error("Interview already withdrawn");
    }

    if (user.id !== interviewRequest.interviewer.toString()) {
      res.status(403);
      throw new Error("Only author can perform this operation");
    }

    const interviewer = await User.findById(interviewRequest.interviewer);
    const interviewee = await User.findById(request.user);

    if (!interviewer?.refreshToken || !interviewee?.refreshToken) {
      res.status(400);
      throw new Error("Both users must connect Google Calendar to proceed.");
    }

    const meetLink = await createGoogleMeetEvent({
      organizer: interviewer,
      summary: `Interview: ${interviewRequest.role}`,
      interviewTime: request.selectedSlot,
      interviewee,
      interviewer,
    });

    const interview = await Interview.create({
      role: interviewRequest.role,
      time: request.selectedSlot,
      interviewee,
      interviewer,
      interviewLink: meetLink,
    });

    interviewRequest.isAccepted = true;

    await interviewRequest.save();

    res.status(200).json({
      success: true,
      message: "Interview setup successfully",
      data: interview,
    });
  }
);

// @desc   Withdraw a broadcasted interview request
// @route  POST /api/interview/request/broadcasted/withdraw/:interviewRequestId
// @access Private
const withdrawBroadcastedInterviewRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interviewRequestId = req.params.interviewRequestId;
    console.log({ interviewRequestId });

    if (!interviewRequestId) {
      res.status(403);
      throw new Error("No interview id found!");
    }

    const interviewRequest = await BroadcastedInterviewRequest.findById(
      interviewRequestId
    );

    if (!interviewRequest) {
      res.status(404);
      throw new Error("Interview request not found or inaccessible");
    }

    if (interviewRequest.isAccepted === true) {
      res.status(400);
      throw new Error("Interview already accepted");
    }

    if (interviewRequest.isWithdrawn === true) {
      res.status(400);
      throw new Error("Interview already withdrawn");
    }

    if (user.id !== interviewRequest.interviewer.toString()) {
      res.status(403);
      throw new Error("You are not authorized to withdraw the request");
    }

    interviewRequest.isWithdrawn = true;

    await interviewRequest.save();

    res.status(200).json({
      success: true,
      message: "Interview setup successfully",
      data: interviewRequest,
    });
  }
);

export {
  getBroadcastedInterviewReceivedRequests,
  getBroadcastedInterviewSentRequests,
  getBroadcastedInterviewRequest,
  requestBroadcastedInterview,
  applyToBroadcastedInterview,
  acceptBroadcastedInterviewRequest,
  withdrawBroadcastedInterviewRequest,
};
