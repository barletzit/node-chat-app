import express from "express";
import { Server } from "socket.io";
import http from "http";

type ChatMessage = {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: "user" | "system";
};

const PORT = 3000;

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  const username = socket.handshake.auth.username;
  console.log("User connected", {
    id: socket.id,
    username: socket.handshake.auth.username,
  });

  socket.broadcast.emit("new_message", {
    id: Date.now().toString(),
    username: "System",
    message: `${username} has joined the chat`,
    timestamp: new Date(),
    type: "system",
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${username} (${socket.id})`);
    socket.broadcast.emit("new_message", {
      id: Date.now().toString(),
      username: "System",
      message: `${username} has left the chat`,
      timestamp: new Date(),
      type: "system",
    });
  });

  socket.on("send_message", (message: string) => {
    const chatMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      username,
      message,
      timestamp: new Date(),
      type: "user",
    };

    io.emit("new_message", chatMessage);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", {
      id: socket.id,
      username: socket.handshake.auth.username,
    });
  });
});

server.listen(PORT, () => {
  console.log(`app is listening on port ${PORT}`);
});
