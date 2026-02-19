import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "mploychek_secret_key";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    userId: string;
    role: string;
    name: string;
  };
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    req.user = {
      id: decoded.id,
      userId: decoded.userId,
      role: decoded.role,
      name: decoded.name
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

export { authMiddleware, JWT_SECRET };
