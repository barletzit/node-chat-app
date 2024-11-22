import { FormEvent, useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";

type ChatMessage = {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: "user" | "system";
};

type ChatRoomProps = {
  username: string;
};

export const ChatRoom: React.FC<ChatRoomProps> = ({ username }) => {
  const { socket, connect, disconnect, isConnected } = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasConnectedBefore, setHasConnectedBefore] = useState(false);

  useEffect(() => {
    if (!socket) {
      connect(username);
    }
  }, [socket, connect, username]);

  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("new_message");
    };
  }, [socket]);

  useEffect(() => {
    if (isConnected && !hasConnectedBefore) {
      setHasConnectedBefore(true);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: "Connected to chat",
          timestamp: new Date(),
          type: "system",
        },
      ]);
    } else if (message.length && !hasConnectedBefore) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          username: "System",
          message: "Disconnected from chat",
          timestamp: new Date(),
          type: "system",
        },
      ]);
    }
  }, [hasConnectedBefore, isConnected, message.length]);

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !socket) return;

    socket.emit("send_message", message);
    setMessage("");
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, margin: "auto" }}>
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" gutterBottom>
            Chat Room
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isConnected ? "Connected" : "Disconnected"} - {username}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="error"
          onClick={disconnect}
          disabled={!isConnected}
        >
          Disconnect
        </Button>
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          height: "400px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1,
          bgcolor: "background.paper",
        }}
      >
        {messages.map((msg) =>
          msg.type === "system" ? (
            <Typography
              key={msg.id}
              variant="body2"
              align="center"
              sx={{
                py: 1,
                px: 2,
                color: "text.secondary",
                bgcolor: "background.default",
                borderRadius: 1,
                alignSelf: "center",
              }}
            >
              {msg.message}
            </Typography>
          ) : (
            <Box
              key={msg.id}
              sx={{
                p: 1,
                bgcolor:
                  msg.username === username
                    ? "primary.dark"
                    : "background.default",
                borderRadius: 1,
                alignSelf:
                  msg.username === username ? "flex-end" : "flex-start",
                maxWidth: "80%",
              }}
            >
              <Typography
                variant="caption"
                color={
                  msg.username === username ? "common.white" : "text.secondary"
                }
              >
                {msg.username}
              </Typography>
              <Typography
                variant="body1"
                color={
                  msg.username === username ? "common.white" : "text.primary"
                }
                sx={{ my: 0.5 }}
              >
                {msg.message}
              </Typography>
              <Typography
                variant="caption"
                color={
                  msg.username === username ? "common.white" : "text.secondary"
                }
                display="block"
                sx={{ opacity: 0.8 }}
              >
                {new Date(msg.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>
          )
        )}
      </Paper>

      <Paper
        elevation={3}
        sx={{
          p: 2,
          bgcolor: "background.paper",
        }}
      >
        <form onSubmit={handleSend}>
          <Box sx={{ display: "flex", gap: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={
                isConnected ? "Type your message..." : "Disconnected from chat"
              }
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!isConnected}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "text.secondary",
                  },
                  "&:hover fieldset": {
                    borderColor: "text.primary",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={!isConnected || !message.trim()}
              sx={{
                px: 3,
                bgcolor: "primary.main",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              Send
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};
