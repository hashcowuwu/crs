
import { Server } from "socket.io";
import { createServer } from "http";

interface ServerToClientEvents {
  noArg: () => void;
  message: (message: string) => void;

  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}



interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}
const httpServer = createServer();
const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
    cors: {
        origin: ["http://localhost:3000"],
    },
});

interface ClientToServerEvents {
        message: (message: string) => void;
}


io.on("connection", (socket) => {
  console.log(socket.id + "connected!");
  socket.on("message", (message) => {
    //监听message
    console.log(`${socket.id}:${message}`);
    socket.broadcast.emit(
      "message",
      JSON.stringify({
        user: socket.id,
        message: message,
      }),
    );
  });
});
io.listen(4000);