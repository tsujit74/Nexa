// middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: any;
  token?:string;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      authHeader?.split(" ")[1] ||
      (req.query.token && typeof req.query.token === "string"
        ? req.query.token
        : null);

    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not found" });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    return res
      .status(401)
      .json({ message: "Unauthorized: Invalid token" });
  }
};
