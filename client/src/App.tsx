import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { useState } from "react";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { ChatRoom } from "./components/ChatRoom";
import { SocketProvider } from "./context/SocketContext";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function AppContent() {
  const [isRegisterView, setIsRegisterView] = useState(false);
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <ChatRoom />;
  }

  return isRegisterView ? (
    <Register onSwitchToLogin={() => setIsRegisterView(false)} />
  ) : (
    <Login onSwitchToRegister={() => setIsRegisterView(true)} />
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppContent />
        </ThemeProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
