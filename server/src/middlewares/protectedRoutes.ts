import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User, { UserType } from "../Models/User";
import { asyncHandler } from "../utils/asyncHandler";

interface DecodedToken extends JwtPayload {
  id: string;
}

export const protectedRoute = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      res.status(401);
      return next(new Error("User not authenticated"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as DecodedToken;

      const user: UserType = await User.findById(decoded.id).select(
        "-password"
      );
      if (!user) {
        res.status(404);
        return next(new Error("User not found!"));
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      return next(new Error("User not authenticated"));
    }
  }
);
