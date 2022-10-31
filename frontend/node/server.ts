const express = require("express");
const cors = require("cors");

const app = express();
const http = require("http");

const httpServer = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(httpServer, {
  cors: {
    origin: "*"
  },
  transports: ["websocket"]
});

httpServer.listen(8000, () => {
  console.log("listening!!");
});

io.on("connection", (socket: any) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected-123--!!");
  });
  socket.on("chat", (msg: any) => {
    console.log(`message: ${msg}`);
  });
});
