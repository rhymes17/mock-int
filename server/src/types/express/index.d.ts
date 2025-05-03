import { UserDocument } from "../../Models/User";

declare module "express-serve-static-core" {
  interface Request {
    user?: UserDocument;
  }
}
