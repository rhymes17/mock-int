import express from "express";
import {
  getAllSkills,
  getSkill,
  registerSkill,
} from "../controllers/skill.controller";
import { protectedRoute } from "../middlewares/protectedRoutes";

const router = express.Router();

router
  .route("/")
  .get(protectedRoute, getAllSkills)
  .post(protectedRoute, registerSkill);
router.get("/:skillId", getSkill);

export default router;
