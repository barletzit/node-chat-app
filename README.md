# Real-Time Chat Application

A real-time chat application built with React, TypeScript, Socket.IO, and Material-UI.

## Features

- Real-time messaging
- Dark theme
- Connection status tracking
- System messages for connection events
- User-friendly interface
- Message timestamps
- Visual distinction between sent and received messages

## Tech Stack

- Frontend:
  - React
  - TypeScript
  - Material-UI (MUI)
  - Socket.IO Client
  - Vite

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - TypeScript

## Project Structure

```
project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom.tsx
│   │   │   └── Login.tsx
│   │   ├── context/
│   │   │   └── SocketContext.tsx
│   │   ├── hooks/
│   │   │   └── useSocket.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── server/
    ├── src/
    │   └── index.ts
    └── package.json
```

## Setup and Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install server dependencies
```bash
cd server
npm install
```

3. Install client dependencies
```bash
cd client
npm install
```

4. Start the server
```bash
cd server
npm run dev
```

5. Start the client
```bash
cd client
npm run dev
```

The client will run on `http://localhost:5173` and the server on `http://localhost:3000`

## Environment Variables

Create `.env` files in both client and server directories if needed:

```env
# server/.env
PORT=3000

# client/.env
VITE_SERVER_URL=http://localhost:3000
```

## Usage

1. Open the application in your browser
2. Open another tab in your browser
3. Enter a username to join the chat in both tabs
4. Start sending messages
5. Use the disconnect button to leave the chat

## Socket Events

### Client Events
- `connect`: Initiated when joining the chat
- `disconnect`: Triggered when leaving the chat
- `send_message`: Emitted when sending a message

### Server Events
- `connection`: Handles new client connections
- `new_message`: Broadcasts messages to all clients
- `disconnect`: Handles client disconnections

## Component Structure

### SocketContext
Manages Socket.IO connection and provides connection status to components:
```typescript
type SocketContextType = {
  socket: Socket | null;
  connect: (username: string) => void;
  disconnect: () => void;
  isConnected: boolean;
};
```

### ChatRoom
Handles the chat interface and message management:
```typescript
interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system';
}
```

### Login
Manages user authentication and entry to the chat:
```typescript
type LoginProps = {
  onLogin: (username: string) => void;
};
```

## Styling

The application uses Material-UI's dark theme by default. Theme configuration:

```typescript
const theme = createTheme({
  palette: {
    mode: "dark",
  },
});
```

## Future Improvements

- Add user authentication
- Persist messages
- Add private messaging
- Add emoji support
- Add file sharing
- Add typing indicators
- Add read receipts
- Add user online status
- Add message search
- Add message reactions
