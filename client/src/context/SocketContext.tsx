import { createContext, useCallback, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { config } from "../config";
import { useAuth } from "../hooks/useAuth";

type SocketContextType = {
  socket: Socket | null;
  connect: (username: string) => void;
  disconnect: () => void;
  isConnected: boolean;
};

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(
    (username: string) => {
      const newSocket = io(config.serverUrl, {
        auth: { username, token },
      });

      setSocket(newSocket);
    },
    [token]
  );

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const onConnect = () => {
      console.log("Socket connected");
      setIsConnected(true);
    };

    const onConnectError = (error: Error) => {
      console.log("Connection error:", error);
      setIsConnected(false);
    };

    const onDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);

    return () => {
      console.log("Cleaning up socket listeners");
      socket.off("connect");
      socket.off("disconnect");
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
    };
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{ socket, connect, disconnect, isConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};
