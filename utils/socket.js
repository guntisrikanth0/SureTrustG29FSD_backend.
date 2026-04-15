import { Server } from "socket.io";

let io;

export const initSocket = (server, allowedOrigins) => {
  // Use the passed array, or default to a safe value if empty
  const origins = allowedOrigins && allowedOrigins.length > 0 ? allowedOrigins : "*";

  io = new Server(server, {
    cors: { 
      origin: origins,
      methods: ["GET", "POST"],
      credentials: true,
    },
    // Best practices for Render/Cloud hosting
    transports: ["websocket", "polling"], 
    allowEIO3: true, 
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log("✅ Socket connected:", socket.id);

    // Join a project room
    socket.on("joinProject", ({ projectId }) => {
      if (!projectId) return;
      const room = `project_${projectId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined room ${room}`);
    });

    // Join a user room for direct messages
    socket.on("joinUser", ({ userId }) => {
      if (!userId) return;
      const room = `user_${userId}`;
      socket.join(room);
      console.log(`Socket ${socket.id} joined user room ${room}`);
    });

    // Leave a project room
    socket.on("leaveProject", ({ projectId }) => {
      if (!projectId) return;
      const room = `project_${projectId}`;
      socket.leave(room);
      console.log(`Socket ${socket.id} left room ${room}`);
    });

    // Leave a user room
    socket.on("leaveUser", ({ userId }) => {
      if (!userId) return;
      const room = `user_${userId}`;
      socket.leave(room);
      console.log(`Socket ${socket.id} left user room ${room}`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected (${socket.id}): ${reason}`);
    });
  });

  return io;
};

export const getSocketIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};