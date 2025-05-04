import { UserType } from "../../Models/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}
