Here's the updated README with the latest features and structure:

# Real-Time Chat Application

A real-time chat application built with React, TypeScript, Socket.IO, and Material-UI.

## Features

- Real-time messaging
- User authentication with JWT
- Session-based login (tab-specific)
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
  - JWT Decode
  - Axios
  - Vite

- Backend:
  - Node.js
  - Express
  - Socket.IO
  - TypeScript
  - JWT
  - Prisma
  - PostgreSQL
  - bcrypt

## Project Structure

```
project/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatRoom.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── context/
│   │   │   ├── SocketContext.tsx
│   │   │   └── AuthContext.tsx
│   │   ├── hooks/
│   │   │   ├── useSocket.ts
│   │   │   └── useAuth.ts
│   │   ├── api/
│   │   │   └── auth.ts
│   │   ├── config/
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── package.json
│
└── server/
    ├── src/
    │   ├── auth.ts
    │   ├── socket.ts
    │   └── index.ts
    ├── prisma/
    │   └── schema.prisma
    ├── docker-compose.db.yaml
    └── package.json
```

## Setup and Installation

1. Clone the repository
```bash
git clone <repository-url>
```

2. Set up PostgreSQL database using Docker
```bash
cd server
docker compose -f docker-compose.db.yaml up -d
```

3. Install server dependencies and set up Prisma
```bash
npm install
npx prisma generate
npx prisma db push
```

4. Install client dependencies
```bash
cd ../client
npm install
```

5. Create environment files:

```env
# server/.env
PORT=3000
DATABASE_URL="postgresql://<db_user>:<db_password>@localhost:5432/<db_name>"
JWT_SECRET="your-secret-key"

# client/.env
VITE_SERVER_URL=http://localhost:3000
```

6. Start the development servers
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

## Authentication Flow

1. Register:
- User enters username and password
- Server hashes password and stores in database
- Returns JWT token
- Auto-login after registration

2. Login:
- User enters credentials
- Server validates and returns JWT token
- Token stored in sessionStorage (tab-specific)

3. Socket Authentication:
- Socket connections include JWT token
- Server validates token before allowing connection
- Username extracted from verified token

## Socket Events

### Client Events
- `connect`: Initiated with JWT authentication
- `disconnect`: Triggered on logout or tab close
- `send_message`: Emitted when sending a message

### Server Events
- `connection`: Handles new authenticated connections
- `new_message`: Broadcasts messages to all clients
- `disconnect`: Handles client disconnections

## Component Structure

### AuthContext
Manages authentication state and token:
```typescript
type AuthContextType = {
  token: string | null;
  username: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};
```

### SocketContext
Manages Socket.IO connection with authentication:
```typescript
type SocketContextType = {
  socket: Socket | null;
  connect: (username: string) => void;
  disconnect: () => void;
  isConnected: boolean;
};
```

### ChatRoom
Handles authenticated chat interface:
```typescript
interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system';
}
```

## Future Improvements

- Add password reset functionality
- Add email verification
- Add user profiles
- Add private messaging
- Add file sharing
- Add typing indicators
- Add read receipts
- Add message persistence
- Add user online status
- Add message search
- Add message reactions
- Add group chat functionality
