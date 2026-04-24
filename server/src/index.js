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
const port = process.env.PORT || 5001;

app.use(helmet());
const defaultClientUrl = process.env.CLIENT_URL || "http://localhost:5174";
const allowedOrigins = Array.from(
  new Set([
    defaultClientUrl,
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(",") : []),
  ]).values(),
).map((origin) => origin.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin))
        return callback(null, true);
      return callback(new Error(`CORS blocked by origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250 }));

app.get("/health", (_, res) => res.json({ ok: true, name: "Focus Forge API" }));
app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/system-design", systemRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/calendar", calendarRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(errorHandler);

connectDb().then(() => {
  app.listen(port, "0.0.0.0", () => {
    console.log(`Focus Forge API listening on ${port}`);
  });
});
