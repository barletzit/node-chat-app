import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import "./App.css";
import { useState } from "react";
import { Login } from "./components/Login";
import { ChatRoom } from "./components/ChatRoom";
import { SocketProvider } from "./context/SocketContext";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

function App() {
  const [username, setUserName] = useState("");

  const handleLogin = (username: string) => {
    setUserName(username);
  };

  return (
    <SocketProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {!username ? (
          <Login onLogin={handleLogin} />
        ) : (
          <ChatRoom username={username} />
        )}
      </ThemeProvider>
    </SocketProvider>
  );
}

export default App;
