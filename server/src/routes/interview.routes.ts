import express from "express";
import {
  acceptBroadcastedInterviewRequest,
  acceptPeerToPeerInterviewRequest,
  applyToBroadcastedInterview,
  getBroadcastedInterviewReceivedRequests,
  getBroadcastedInterviewRequest,
  getBroadcastedInterviewSentRequests,
  getEligibleInterviewees,
  getEligibleInterviewers,
  getPeerToPeerInterviewReceivedRequests,
  getPeerToPeerInterviewRequest,
  getPeerToPeerInterviewSentRequests,
  rejectPeerToPeerInterviewRequest,
  requestBroadcastedInterview,
  requestPeerToPeerInterview,
  withdrawBroadcastedInterviewRequest,
  withdrawPeerToPeerInterviewRequest,
} from "../controllers/interview.controller";
import { protectedRoute } from "../middlewares/protectedRoutes";

const router = express.Router();

router.get("/list-candidates", protectedRoute, getEligibleInterviewees);
router.get("/list-interviewers", protectedRoute, getEligibleInterviewers);
router.get(
  "/request/peer-to-peer/received",
  protectedRoute,
  getPeerToPeerInterviewReceivedRequests
);
router.get(
  "/request/peer-to-peer/sent",
  protectedRoute,
  getPeerToPeerInterviewSentRequests
);
router.get(
  "/request/peer-to-peer/:interviewRequestId",
  protectedRoute,
  getPeerToPeerInterviewRequest
);
router.post(
  "/request/peer-to-peer/:otherUserId",
  protectedRoute,
  requestPeerToPeerInterview
);

router.get(
  "/request/broadcasted/received",
  protectedRoute,
  getBroadcastedInterviewReceivedRequests
);
router.get(
  "/request/broadcasted/sent",
  protectedRoute,
  getBroadcastedInterviewSentRequests
);
router.get(
  "/request/broadcasted/:interviewRequestId",
  protectedRoute,
  getBroadcastedInterviewRequest
);
router.post(
  "/request/broadcasted/",
  protectedRoute,
  requestBroadcastedInterview
);

router.post(
  "/request/broadcasted/:broadcastedInterviewId",
  protectedRoute,
  applyToBroadcastedInterview
);

router.post(
  "/request/peer-to-peer/accept/:interviewRequestId",
  protectedRoute,
  acceptPeerToPeerInterviewRequest
);

router.post(
  "/request/broadcasted/accept/:interviewRequestId",
  protectedRoute,
  acceptBroadcastedInterviewRequest
);

router.put(
  "/request/peer-to-peer/reject/:interviewRequestId",
  protectedRoute,
  rejectPeerToPeerInterviewRequest
);

router.put(
  "/request/peer-to-peer/withdraw/:interviewRequestId",
  protectedRoute,
  withdrawPeerToPeerInterviewRequest
);

router.put(
  "/request/broadcasted/withdraw/:interviewRequestId",
  protectedRoute,
  withdrawBroadcastedInterviewRequest
);

export default router;
