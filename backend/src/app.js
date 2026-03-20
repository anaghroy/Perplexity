import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRouter from "./routes/auth.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import chatRouters from "./routes/chat.routes.js"

const app = express();
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("./public"));
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    credentials: true,
  }),
);
//Health check
app.get("/", (req, res) => {
  res.json({ message: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/ai", aiRoutes);
app.use("/api/chat", chatRouters)

/**Universal method */
app.use("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "/public/index.html"));
});
export default app;
