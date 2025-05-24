import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import User, { UserType } from "../Models/User";
import PeerToPeerInterviewRequest, {
  IPeerToPeerInterviewRequest,
} from "../Models/PeerToPeerInterviewRequest";
import Interview from "../Models/Interview";
import { createGoogleMeetEvent } from "../utils/createGoogleMeetEvent";

// @desc   Get all received peer-to-peer interview requests
// @route  GET /api/interview/request/peer-to-peer/received
// @access Private
const getPeerToPeerInterviewReceivedRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interviewRequests = await PeerToPeerInterviewRequest.find({
      $and: [
        {
          $or: [{ interviewee: user._id }, { interviewer: user._id }],
        },
        {
          requestedBy: { $ne: user._id },
        },
      ],
    }).populate({
      path: "interviewer interviewee requestedBy",
      select: "-accessToken -refreshToken -googleId",
      populate: {
        path: "profile.skills.skill",
        model: "Skill",
      },
    });

    res.status(200).json({
      success: true,
      message: "Interview requests fetched successfully",
      data: interviewRequests,
    });
  }
);

// @desc   Get all sent peer-to-peer interview requests
// @route  GET /api/interview/request/peer-to-peer/sent
// @access Private
const getPeerToPeerInterviewSentRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interviewRequests = await PeerToPeerInterviewRequest.find({
      requestedBy: user._id,
    }).populate({
      path: "interviewer interviewee requestedBy",
      select: "-accessToken -refreshToken -googleId",
      populate: {
        path: "profile.skills.skill",
        model: "Skill",
      },
    });

    res.status(200).json({
      success: true,
      message: "Interview requests fetched successfully",
      data: interviewRequests,
    });
  }
);

// @desc   Get a peer-to-peer interview request
// @route  GET /api/interview/request/peer-to-peer/:interviewRequestId
// @access Private
const getPeerToPeerInterviewRequest = asyncHandler(
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

    const interviewRequest = await PeerToPeerInterviewRequest.findOne({
      $and: [
        {
          $or: [{ interviewee: user._id }, { interviewer: user._id }],
        },
        {
          _id: interviewRequestId,
        },
      ],
    }).populate({
      path: "interviewer interviewee requestedBy",
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

// @desc   Make peer to peer interview request
// @route  POST /api/interview/request/peer-to-peer/:otherUserId
// @access Private
const requestPeerToPeerInterview = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const otherUserId = req.params.otherUserId;

    if (user._id == otherUserId) {
      res.status(403);
      throw new Error("Both users cannot be same");
    }

    const otherUser = await User.findById(otherUserId);

    if (!otherUser) {
      res.status(404);
      throw new Error("Other user not found");
    }

    const {
      requestType,
      role,
      availability,
    }: {
      requestType: "interviewer" | "interviewee";
      role: string;
      availability: Date[];
    } = req.body;

    if (!requestType) {
      throw new Error("Request type not defined!");
    }

    if (!role) {
      throw new Error("Role must be defined!");
    }

    if (availability.length === 0) {
      res.status(400);
      throw new Error("No availalibity set");
    }

    let peerToPeerInterviewRequest: IPeerToPeerInterviewRequest = {
      role,
      availability,
      requestedBy: user,
      interviewer: user,
      interviewee: user,
      isAccepted: false,
      isRejected: false,
      isWithdrawn: false,
    };

    // If requested an interview as an interviewer
    if (requestType === "interviewer") {
      peerToPeerInterviewRequest.interviewer = user;
      peerToPeerInterviewRequest.interviewee = otherUser;
    } else {
      peerToPeerInterviewRequest.interviewee = user;
      peerToPeerInterviewRequest.interviewer = otherUser;
    }

    const peerToPeerInterviewRequestDoc =
      await PeerToPeerInterviewRequest.create(peerToPeerInterviewRequest);

    res.status(200).json({
      success: true,
      message: "Interview requested successfully",
      data: peerToPeerInterviewRequestDoc,
    });
  }
);

// @desc   Accept a peer to peer interview request
// @route  POST /api/interview/request/peer-to-peer/accept/:interviewRequestId
// @access Private
const acceptPeerToPeerInterviewRequest = asyncHandler(
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

    let { selectedSlot } = req.body;
    selectedSlot = new Date(selectedSlot).toISOString();

    if (!selectedSlot) {
      res.status(404);
      throw new Error("No slot selected");
    }

    const interviewRequest = await PeerToPeerInterviewRequest.findOne({
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
      throw new Error("Request is already accepted");
    }

    if (interviewRequest.isRejected === true) {
      res.status(400);
      throw new Error("Request is already rejected");
    }

    if (interviewRequest.isWithdrawn === true) {
      res.status(400);
      throw new Error("Request was withdrawn");
    }

    const selectedTime = new Date(selectedSlot);
    const now = new Date();

    const oneDayInMs = 24 * 60 * 60 * 1000;

    if (selectedTime.getTime() - now.getTime() < oneDayInMs) {
      res.status(400);
      throw new Error(
        "Interview must be scheduled at least 24 hours in advance"
      );
    }

    if (user.id === interviewRequest.requestedBy.toString()) {
      res.status(403);
      throw new Error("You are not authorized to accept this request");
    }

    const interviewer = await User.findById(interviewRequest.interviewer);
    const interviewee = await User.findById(interviewRequest.interviewee);
    const requester = await User.findById(interviewRequest.requestedBy);

    if (!requester) {
      res.status(400);
      throw new Error("Requester not found!");
    }

    if (!interviewer?.refreshToken || !interviewee?.refreshToken) {
      res.status(400);
      throw new Error("Both users must connect Google Calendar to proceed.");
    }

    const meetLink = await createGoogleMeetEvent({
      organizer: requester,
      summary: `Interview: ${interviewRequest.role}`,
      interviewTime: selectedSlot,
      interviewee,
      interviewer,
    });

    const interview = await Interview.create({
      role: interviewRequest.role,
      time: selectedSlot,
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

// @desc   Reject a peer to peer interview request
// @route  POST /api/interview/request/peer-to-peer/reject/:interviewRequestId
// @access Private
const rejectPeerToPeerInterviewRequest = asyncHandler(
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

    const interviewRequest = await PeerToPeerInterviewRequest.findOne({
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
      throw new Error("Request is already accepted");
    }

    if (interviewRequest.isRejected === true) {
      res.status(400);
      throw new Error("Request is already rejected");
    }

    if (interviewRequest.isWithdrawn === true) {
      res.status(400);
      throw new Error("Request was withdrawn");
    }

    if (user.id === interviewRequest.requestedBy) {
      res.status(403);
      throw new Error("You are not authorized to reject this request");
    }

    interviewRequest.isRejected = true;

    await interviewRequest.save();

    res.status(200).json({
      success: true,
      message: "Interview setup successfully",
      data: interviewRequest,
    });
  }
);

// @desc   Withdraw a peer to peer interview request
// @route  POST /api/interview/request/peer-to-peer/withdraw/:interviewRequestId
// @access Private
const withdrawPeerToPeerInterviewRequest = asyncHandler(
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

    const interviewRequest = await PeerToPeerInterviewRequest.findOne({
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
      throw new Error("Request is already accepted");
    }

    if (interviewRequest.isRejected === true) {
      res.status(400);
      throw new Error("Request is already rejected");
    }

    if (interviewRequest.isWithdrawn === true) {
      res.status(400);
      throw new Error("Request was withdrawn");
    }

    if (user.id !== interviewRequest.requestedBy.toString()) {
      res.status(403);
      throw new Error("You are not authorized to withdraw this request");
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
  getPeerToPeerInterviewReceivedRequests,
  getPeerToPeerInterviewSentRequests,
  getPeerToPeerInterviewRequest,
  requestPeerToPeerInterview,
  rejectPeerToPeerInterviewRequest,
  withdrawPeerToPeerInterviewRequest,
  acceptPeerToPeerInterviewRequest,
};
