import express, { Request, Response } from "express";
import { oAuthCallback, oAuthLogin } from "../controllers/auth.controller";

const router = express.Router();

router.get("/login", oAuthLogin);
router.get("/callback/google", oAuthCallback);

export default router;
