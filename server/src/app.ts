import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/errorMiddleware";

//routes imports
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import skillRoutes from "./routes/skill.routes";

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
app.use(errorHandler);

export default app;
