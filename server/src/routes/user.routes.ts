import express from "express";
import { editUserProfile, getLoggedInUser, getUserProfile } from "../controllers/user.controller";
import { protectedRoute } from "../middlewares/protectedRoutes";

const router = express.Router();

router.get('/me', protectedRoute, getLoggedInUser)
router.get("/:id", getUserProfile);
router.put("/:id", protectedRoute, editUserProfile)

export default router;
