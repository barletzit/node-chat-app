import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";

type LoginProps = {
  onLogin: (username: string) => void;
};

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }
    onLogin(username);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: "100%" }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Join Chat
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              variant="outlined"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={!!error}
              helperText={error}
              autoFocus
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Join
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
