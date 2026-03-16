import "dotenv/config";
import {createServer} from "http"
import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import { initSocket } from "./src/sockets/server.socket.js";

const PORT = process.env.PORT || 3000;

connectDB().catch((err) => {
  console.error("MongoDB connection failed:", err);
  process.exit(1);
});

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
