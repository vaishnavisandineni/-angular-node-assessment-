import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

function adminOnly(req: AuthRequest, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

export { adminOnly };
