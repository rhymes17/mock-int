import express, { Request, Response } from "express";
import {
  oAuthCallback,
  oAuthLogin,
  oAuthLogout,
} from "../controllers/auth.controller";
import { protectedRoute } from "../middlewares/protectedRoutes";

const router = express.Router();

router.get("/login", oAuthLogin);
router.get("/callback/google", oAuthCallback);
router.post("/logout", protectedRoute, oAuthLogout);

export default router;
