import axios from "axios";
import { config } from "../config";

const api = axios.create({
  baseURL: config.serverUrl,
});

type AuthResponse = {
  token: string;
};

export const register = async (
  username: string,
  password: string
): Promise<string> => {
  const { token } = await authenticate("/auth/register", username, password);

  return token;
};

export const login = async (
  username: string,
  password: string
): Promise<string> => {
  const { token } = await authenticate("/auth/login", username, password);

  return token;
};

const authenticate = async (
  authURL: string,
  username: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>(authURL, {
    username,
    password,
  });

  return data;
};
