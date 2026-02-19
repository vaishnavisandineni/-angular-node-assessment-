import { Router } from "express";
import jwt from "jsonwebtoken";
import { readJson } from "../utils/fileDb";
import { JWT_SECRET } from "../middleware/auth.middleware";

type User = {
  id: string;
  name: string;
  userId: string;
  password: string;
  role: "Admin" | "General User";
};

const router = Router();

router.post("/login", (req, res) => {
  const { userId, password, role } = req.body;

  if (!userId || !password || !role) {
    return res.status(400).json({ message: "userId, password, role are required" });
  }

  const users = readJson<User[]>("data/users.json");

  const user = users.find(
    (u) => u.userId === userId && u.password === password && u.role === role
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { id: user.id, userId: user.userId, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      userId: user.userId,
      role: user.role
    }
  });
});

export default router;
