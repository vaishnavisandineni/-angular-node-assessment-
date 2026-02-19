import { Router } from "express";
import { readJson } from "../utils/fileDb";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";

type RecordItem = {
  id: string;
  ownerUserId: string;
  title: string;
  status: string;
  createdAt: string;
};

const router = Router();

/**
 * GET /api/records
 * - Admin: see all
 * - General User: only their own
 */
router.get("/", authMiddleware, (req: AuthRequest, res) => {
  const records = readJson<RecordItem[]>("data/records.json");

  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role === "Admin") {
    return res.json(records);
  }

  const userRecords = records.filter((r) => r.ownerUserId === req.user?.userId);
  return res.json(userRecords);
});

export default router;
