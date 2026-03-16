import { Server } from "socket.io";

let io;
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: ["http://localhost:5173", process.env.FRONTEND_URL],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join:chat", (chatId) => {
      socket.join(`chat:${chatId}`);
      console.log(`Socket ${socket.id} joined room chat:${chatId}`); // 👈 verify this logs
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
  return io;
};

export const waitForRoom = (chatId, timeoutMs = 5000) => {
  return new Promise((resolve, reject) => {
    const room = `chat:${chatId}`;
    const interval = setInterval(() => {
      const roomSockets = io.sockets.adapter.rooms.get(room);
      if (roomSockets && roomSockets.size > 0) {
        clearInterval(interval);
        resolve();
      }
    }, 100); // check every 100ms

    setTimeout(() => {
      clearInterval(interval);
      reject(new Error("Timeout waiting for client to join room"));
    }, timeoutMs);
  });
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
