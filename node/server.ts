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
  SocketData,
  UserProfileType,
} from "./socket.type";

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
    credentials: true,
  },
  transports: ["websocket"],
});

instrument(io, { auth: false });

httpServer.listen(8000, () => {
  console.log("listening!!");
});

interface ProblemInfoType {
  title: string;
  problemId: number;
  solvedUser: string[];
}
interface StudyInfoType {
  startTime: number;
  problems: ProblemInfoType[];
  duringMinute: number;
}
const studyInfos = new Map<number, StudyInfoType>();
const userInfos = new Map<string, number>();

const getUserList = async (studyId: string): Promise<UserProfileType[]> => {
  const Users = await io.in(studyId).fetchSockets();
  return Users.map((user) => ({
    name: user.data.name,
    imageUrl: user.data.imageUrl,
  }));
};

io.on("connection", (socket) => {
  socket.on("enter", async (studyId, name, imageUrl, cb) => {
    console.log(`${studyId}방에 ${name}님이 입장하셨어`);
    socket.data.name = name;
    socket.data.imageUrl = imageUrl;
    userInfos.set(name, studyId);
    socket.join(`${studyId}`);
    socket.to(`${studyId}`).emit("addParticipant", name, imageUrl);
    cb(await getUserList(studyId + ""));
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("removeParticipant", socket.data.name as string);
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected-123--!!");
  });

  socket.on("startStudy", (studyId, problemList, time, callback) => {
    console.log("startStudy", studyId, problemList, time);
    studyInfos.set(studyId, {
      startTime: Date.now(),
      problems: problemList.map((problem) => ({ ...problem, solvedUser: [] })),
      duringMinute: time,
    });

    io.to(`${studyId}`).emit("startSolve");

    setTimeout(() => {
      io.to(`${studyId}`).emit("endStudy");
    }, time * 1000 * 60);
  });

  socket.on("getSolvingInfo", (callback) => {
    const userStudyId = userInfos.get(socket.data.name as string);
    const studyInfo = studyInfos.get(userStudyId as number);
    const problemInfo = studyInfo!.problems.map((problem) => ({
      title: problem.title,
      problemId: problem.problemId,
      isSolved: problem.solvedUser.includes(socket.data.name as string),
    }));
    callback(problemInfo, studyInfo!.startTime + studyInfo!.duringMinute * 60);
  });
});
