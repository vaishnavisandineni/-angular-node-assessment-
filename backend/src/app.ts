import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import recordRoutes from "./routes/record.routes";
import { delayMiddleware } from "./middleware/delay.middleware";

const app = express();

app.use(cors());
app.use(express.json());

// Delay middleware (for async simulation)
app.use(delayMiddleware);

app.get("/", (req, res) => {
  res.json({ message: "MPloyChek Backend Running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/records", recordRoutes);

export default app;
