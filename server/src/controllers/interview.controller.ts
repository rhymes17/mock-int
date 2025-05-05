import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import User, { UserType } from "../Models/User";
import PeerToPeerInterviewRequest, {
  IPeerToPeerInterviewRequest,
} from "../Models/PeerToPeerInterviewRequest";
import BroadcastedInterviewRequest, {
  IBroadcastedInterviewRequest,
} from "../Models/BroadcastedInterviewRequest";
import Interview from "../Models/Interview";
import { createGoogleMeetEvent } from "../utils/createGoogleMeetEvent";

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

    const users = await User.find();

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

    const users = await User.find();

    res.status(200).json({
      success: true,
      message: "Eligible interviewers fetched successfully",
      data: users,
    });
  }
);

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
    });

    res.status(200).json({
      success: true,
      message: "Interview requests fetched successfully",
      data: interviewRequests,
    });
  }
);

// @desc   Get a peer-to-peer interview request
// @route  GET /api/interview/request/peer-to-peer/:interivewRequestId
// @access Private
const getPeerToPeerInterviewRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interivewRequestId = req.params.interivewRequestId;

    if (!interivewRequestId) {
      res.status(403);
      throw new Error("No interview id found!");
    }

    const interviewRequest = await PeerToPeerInterviewRequest.findOne({
      $and: [
        {
          $or: [{ interviewee: user._id }, { interviewer: user._id }],
        },
        {
          _id: interivewRequestId,
        },
      ],
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
      time,
    }: {
      requestType: "interviewer" | "interviewee";
      role: string;
      time: Date;
    } = req.body;

    if (!requestType) {
      throw new Error("Request type not defined!");
    }

    let peerToPeerInterviewRequest: IPeerToPeerInterviewRequest = {
      role,
      time,
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
    });

    res.status(200).json({
      success: true,
      message: "Interview requests fetched successfully",
      data: interviewRequests,
    });
  }
);

// @desc   Get a broadcasted interview request
// @route  GET /api/interview/request/broadcasted/:interivewRequestId
// @access Private
const getBroadcastedInterviewRequest = asyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as UserType;

    if (!user) {
      res.status(401);
      throw new Error("User not authenticated");
    }

    const interivewRequestId = req.params.interivewRequestId;

    if (!interivewRequestId) {
      res.status(403);
      throw new Error("No interview id found!");
    }

    const interviewRequest = await BroadcastedInterviewRequest.findById(
      interivewRequestId
    );

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
      time,
    }: {
      role: string;
      time: Date;
    } = req.body;

    let broadcastedInterviewRequest: IBroadcastedInterviewRequest = {
      role,
      time,
      interviewer: user,
      interestedInterviewees: [],
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

    broadcastedInterviewDoc.interestedInterviewees.push(user.id);

    await broadcastedInterviewDoc.save();

    res.status(200).json({
      success: true,
      message: "Applied to interview successfully",
      data: broadcastedInterviewDoc,
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

    if (user.id === interviewRequest.requestedBy) {
      res.status(403);
      throw new Error("Author cannot perform this operation");
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
      interviewTime: interviewRequest.time,
      interviewee,
      interviewer,
    });

    const interview = await Interview.create({
      role: interviewRequest.role,
      time: interviewRequest.time,
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

    const interivewRequestId = req.params.interivewRequestId;

    if (!interivewRequestId) {
      res.status(403);
      throw new Error("No interview id found!");
    }

    const { intervieweeId } = req.body;

    if (!intervieweeId) {
      res.status(404);
      throw new Error("Interviewee must be choosen");
    }

    const interviewRequest = await BroadcastedInterviewRequest.findOne({
      $and: [
        {
          $or: [{ interviewee: user._id }, { interviewer: user._id }],
        },
        {
          _id: interivewRequestId,
        },
      ],
    });

    if (!interviewRequest) {
      res.status(404);
      throw new Error("Interview request not found or inaccessible");
    }

    if (user.id !== interviewRequest.interviewer.toString()) {
      res.status(403);
      throw new Error("Only author can perform this operation");
    }

    const interviewer = await User.findById(interviewRequest.interviewer);
    const interviewee = await User.findById(intervieweeId);

    if (!interviewer?.refreshToken || !interviewee?.refreshToken) {
      res.status(400);
      throw new Error("Both users must connect Google Calendar to proceed.");
    }

    const meetLink = await createGoogleMeetEvent({
      organizer: interviewer,
      summary: `Interview: ${interviewRequest.role}`,
      interviewTime: interviewRequest.time,
      interviewee,
      interviewer,
    });

    const interview = await Interview.create({
      role: interviewRequest.role,
      time: interviewRequest.time,
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

export {
  getEligibleInterviewees,
  getEligibleInterviewers,
  getPeerToPeerInterviewReceivedRequests,
  getPeerToPeerInterviewSentRequests,
  getPeerToPeerInterviewRequest,
  requestPeerToPeerInterview,
  getBroadcastedInterviewReceivedRequests,
  getBroadcastedInterviewSentRequests,
  getBroadcastedInterviewRequest,
  requestBroadcastedInterview,
  applyToBroadcastedInterview,
  acceptPeerToPeerInterviewRequest,
  acceptBroadcastedInterviewRequest,
};
