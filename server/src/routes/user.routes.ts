import express from "express";
import { editUserProfile, getUserProfile } from "../controllers/user.controller";
import { protectedRoute } from "../middlewares/protectedRoutes";

const router = express.Router();

router.get("/:id", getUserProfile);
router.put("/:id", protectedRoute, editUserProfile)

export default router;
