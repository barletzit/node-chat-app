import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  username: string;
}

export const handleSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as CustomJwtPayload;
    socket.data.username = decoded.username;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
};
