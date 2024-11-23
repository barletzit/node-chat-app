import { prisma } from "../lib/prisma";
import jwt from "jsonwebtoken";
import { randomBytes, pbkdf2Sync } from "crypto";
import { User } from "@prisma/client";

const handleRegister = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists. Please choose a different one",
      });
    }

    const { hashedPassword } = generatePassword(password);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    const token = generateToken(user);

    return res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong ", error });
  }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;
  const { hashedPassword, salt } = generatePassword(password);
  const isPasswordValid = validPassword(password, hashedPassword, salt);

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    return res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const generateToken = (user: User): string => {
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );

  return token;
};

const generatePassword = (
  password: string
): { salt: string; hashedPassword: string } => {
  const salt = randomBytes(32).toString("hex");
  const hashedPassword = pbkdf2Sync(
    password,
    salt,
    10000,
    64,
    "sha512"
  ).toString("hex");

  return {
    salt,
    hashedPassword,
  };
};

const validPassword = (
  password: string,
  hash: string,
  salt: string
): boolean => {
  const checkHash = pbkdf2Sync(password, salt, 10000, 64, "sha512").toString(
    "hex"
  );
  return hash === checkHash;
};

export { handleLogin, handleRegister };
