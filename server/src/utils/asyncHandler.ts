import { NextFunction, Request, Response } from "express";

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => void) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error: any) {
      console.log("Async handler error", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };