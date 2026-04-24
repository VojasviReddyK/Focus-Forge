import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { connectDb } from "./utils/db.js";
import { errorHandler } from "./middlewares/errorHandler.js";

import authRoutes from "./routes/auth.routes.js";
import dsaRoutes from "./routes/dsa.routes.js";
import systemRoutes from "./routes/system.routes.js";
import jobRoutes from "./routes/job.routes.js";
import postRoutes from "./routes/post.routes.js";
import activityRoutes from "./routes/activity.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";

const app = express();

// ✅ MUST use Render port
const PORT = process.env.PORT || 10000;

// Middleware
app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 250 }));

// ✅ SIMPLE CORS (fixes many deploy issues)
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

// Routes
app.get("/health", (_, res) => res.json({ ok: true, name: "Focus Forge API" }));

app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/system-design", systemRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/analytics", analyticsRoutes);

// Error handler (must be last)
app.use(errorHandler);

// ✅ START SERVER SAFELY
const startServer = async () => {
  try {
    await connectDb();
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ DB failed:", err.message);
  }

  // ✅ ALWAYS start server (Render requirement)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
