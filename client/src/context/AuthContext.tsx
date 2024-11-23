import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

type AuthContextType = {
  token: string | null;
  username: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

type DecodedToken = {
  username: string;
  userId: string;
};

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem("token")
  );

  useEffect(() => {
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUsername(decoded.username);
    } else {
      setUsername(null);
    }
  }, [token]);

  const login = (token: string) => {
    sessionStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        isAuthenticated: !!token,
        username,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
