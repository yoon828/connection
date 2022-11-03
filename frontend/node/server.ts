/* eslint-disable import/no-relative-packages */
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { instrument } from "@socket.io/admin-ui";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
} from "../src/asset/data/socket.type";

const app = express();

const httpServer = http.createServer(app);

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: "*",
    credentials: true
  },
  transports: ["websocket"]
});

instrument(io, { auth: false });

httpServer.listen(8000, () => {
  console.log("listening!!");
});

io.on("connection", socket => {
  socket.on("enter", (studyId, name, imageUrl) => {
    console.log(`${studyId}방에 ${name}님이 입장하셨어`);
    socket.data.name = name;
    socket.join(`${studyId}`);
    socket.to(`${studyId}`).emit("addParticipant", name, imageUrl);
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room =>
      socket.to(room).emit("removeParticipant", socket.data.name as string)
    );
  });
  socket.on("disconnect", () => {
    console.log("user disconnected-123--!!");
  });
  socket.on("chat", (msg: any) => {
    console.log(`message: ${msg}`);
  });
});
