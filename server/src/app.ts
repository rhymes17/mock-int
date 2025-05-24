import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorMiddleware";

//routes imports
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import skillRoutes from "./routes/skill.routes";
import interviewRoutes from "./routes/interview.routes";
import broadcastedInterviewRequestRoutes from "./routes/broadcastedInterviewRequest.routes";
import peerToPeerInterviewRequestRoutes from "./routes/peerToPeerInterviewRequest.routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/interview", interviewRoutes);
app.use(
  "/api/interview/request/broadcasted",
  broadcastedInterviewRequestRoutes
);
app.use(
  "/api/interview/request/peer-to-peer",
  peerToPeerInterviewRequestRoutes
);
app.use(errorHandler);

export default app;
