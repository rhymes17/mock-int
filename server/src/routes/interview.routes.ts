import express from "express";
import { protectedRoute } from "../middlewares/protectedRoutes";
import {
  getEligibleInterviewees,
  getEligibleInterviewers,
} from "../controllers/interview.controller";

const router = express.Router();

router.get("/list-candidates", protectedRoute, getEligibleInterviewees);
router.get("/list-interviewers", protectedRoute, getEligibleInterviewers);

export default router;
