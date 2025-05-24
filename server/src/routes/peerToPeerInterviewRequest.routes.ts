import {
  acceptPeerToPeerInterviewRequest,
  getPeerToPeerInterviewReceivedRequests,
  getPeerToPeerInterviewRequest,
  getPeerToPeerInterviewSentRequests,
  rejectPeerToPeerInterviewRequest,
  requestPeerToPeerInterview,
  withdrawPeerToPeerInterviewRequest,
} from "../controllers/peerToPeerInterviewRequest.controller";
import { protectedRoute } from "../middlewares/protectedRoutes";
import express from "express";

const router = express.Router();

//Get Peer To Peer Interview Received Request
router.get("/received", protectedRoute, getPeerToPeerInterviewReceivedRequests);

//Get Peer To Peer Interview Sent Request
router.get("/sent", protectedRoute, getPeerToPeerInterviewSentRequests);

//Get Peer To Peer Interview Request
router.get(
  "/:interviewRequestId",
  protectedRoute,
  getPeerToPeerInterviewRequest
);

//Request Peer To Peer Interview Request
router.post("/:otherUserId", protectedRoute, requestPeerToPeerInterview);

//Accept Peer To Peer Interview Request
router.post(
  "/accept/:interviewRequestId",
  protectedRoute,
  acceptPeerToPeerInterviewRequest
);

//Reject Peer To Peer Interview Request
router.put(
  "/reject/:interviewRequestId",
  protectedRoute,
  rejectPeerToPeerInterviewRequest
);

//Withdraw Peer To Peer Interview Request
router.put(
  "/withdraw/:interviewRequestId",
  protectedRoute,
  withdrawPeerToPeerInterviewRequest
);

export default router;
