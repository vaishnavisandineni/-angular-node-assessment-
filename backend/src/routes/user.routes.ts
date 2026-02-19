import { Router } from "express";
import { readJson, writeJson } from "../utils/fileDb";
import { authMiddleware } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

type User = {
  id: string;
  name: string;
  userId: string;
  password: string;
  role: "Admin" | "General User";
};

const router = Router();

/**
 * GET /api/users (Admin only)
 */
router.get("/", authMiddleware, adminOnly, (req, res) => {
  const users = readJson<User[]>("data/users.json");

  // Hide password
  const safeUsers = users.map(({ password, ...rest }) => rest);

  return res.json(safeUsers);
});

/**
 * POST /api/users (Admin only)
 */
router.post("/", authMiddleware, adminOnly, (req, res) => {
  const { name, userId, password, role } = req.body;

  if (!name || !userId || !password || !role) {
    return res.status(400).json({ message: "name, userId, password, role required" });
  }

  const users = readJson<User[]>("data/users.json");

  const exists = users.some((u) => u.userId === userId);
  if (exists) {
    return res.status(409).json({ message: "UserId already exists" });
  }

  const newUser: User = {
    id: `u${Date.now()}`,
    name,
    userId,
    password,
    role
  };

  users.push(newUser);
  writeJson("data/users.json", users);

  const { password: _, ...safe } = newUser;
  return res.status(201).json(safe);
});

/**
 * PUT /api/users/:id (Admin only)
 */
router.put("/:id", authMiddleware, adminOnly, (req, res) => {
  const { id } = req.params;
  const { name, password, role } = req.body;

  const users = readJson<User[]>("data/users.json");
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: "User not found" });
  }

  users[index] = {
    ...users[index],
    name: name ?? users[index].name,
    password: password ?? users[index].password,
    role: role ?? users[index].role
  };

  writeJson("data/users.json", users);

  const { password: _, ...safe } = users[index];
  return res.json(safe);
});

/**
 * DELETE /api/users/:id (Admin only)
 */
router.delete("/:id", authMiddleware, adminOnly, (req, res) => {
  const { id } = req.params;

  const users = readJson<User[]>("data/users.json");
  const filtered = users.filter((u) => u.id !== id);

  if (filtered.length === users.length) {
    return res.status(404).json({ message: "User not found" });
  }

  writeJson("data/users.json", filtered);
  return res.json({ message: "User deleted successfully" });
});

export default router;
