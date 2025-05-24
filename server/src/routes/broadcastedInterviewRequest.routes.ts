import express from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import {
  acceptBroadcastedInterviewRequest,
  applyToBroadcastedInterview,
  getBroadcastedInterviewReceivedRequests,
  getBroadcastedInterviewRequest,
  getBroadcastedInterviewSentRequests,
  requestBroadcastedInterview,
  withdrawBroadcastedInterviewRequest,
} from "../controllers/broadcastedInterviewRequest.controller";

const router = express.Router();

// Get Broadcasted Interview Received Requests
router.get(
  "/received",
  protectedRoute,
  getBroadcastedInterviewReceivedRequests
);

// Get Broadcasted Interview Sent Requests
router.get("/sent", protectedRoute, getBroadcastedInterviewSentRequests);

// Get Broadcasted Interview Sent Requests
router.get(
  "/:interviewRequestId",
  protectedRoute,
  getBroadcastedInterviewRequest
);

// Post Broadcasted Interview Request
router.post("/", protectedRoute, requestBroadcastedInterview);

// Apply to Broadcasted Interview
router.post(
  "/:broadcastedInterviewId",
  protectedRoute,
  applyToBroadcastedInterview
);

// Accept Broadcasted Interview Request
router.post(
  "/accept/:interviewRequestId",
  protectedRoute,
  acceptBroadcastedInterviewRequest
);

// Withdraw Broadcasted Interview Sent Request
router.put(
  "/withdraw/:interviewRequestId",
  protectedRoute,
  withdrawBroadcastedInterviewRequest
);

export default router;
