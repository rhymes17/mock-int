import express from "express";
import {
  listEligibleInterviewees,
  listEligibleInterviewers,
} from "../controllers/interview.controller";

const router = express.Router();

router.get("/list-candidates", listEligibleInterviewees);
router.get("/list-interviewers", listEligibleInterviewers);
