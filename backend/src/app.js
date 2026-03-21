import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRouter from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import chatRouters from "./routes/chat.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  }),
);

// API routes — must be BEFORE the static/catch-all
app.use("/api/auth", authRouter);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRouters);

// Serve React build with correct absolute path
app.use(express.static(path.join(__dirname, "../public")));

// Correct catch-all wildcard so React Router handles all frontend routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../public", "index.html"));
});

export default app;