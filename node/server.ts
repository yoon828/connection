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
  level: number;
}
interface UserMapStudyType {
  studyId: number;
}
interface StudyInfoType {
  startTime: number;
  problems: ProblemInfoType[];
  duringMinute: number;
  finishedUser: {
    name: string;
    imageUrl: string;
    problem: number;
    time: number | null;
  }[];
  notFinishedUser: {
    name: string;
    imageUrl: string;
    problem: number;
    time: number | null;
  }[];
}

const studyInfos = new Map<number, StudyInfoType>();
const userMappingStudyId = new Map<string, UserMapStudyType>();

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
    userMappingStudyId.set(name, { studyId });
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

  socket.on("startStudy", async (studyId, problemList, time, callback) => {
    console.log("startStudy", studyId, problemList, time);
    const loginedUser = await getUserList(`${studyId}`);
    studyInfos.set(studyId, {
      startTime: Date.now(),
      problems: problemList.map((problem) => ({ ...problem, solvedUser: [] })),
      duringMinute: time,
      finishedUser: [],
      notFinishedUser: loginedUser.map((user) => ({
        ...user,
        problem: 0,
        time: null,
      })),
    });

    io.to(`${studyId}`).emit("startSolve");

    setTimeout(() => {
      io.to(`${studyId}`).emit("endStudy");
    }, time * 1000 * 60);
  });

  socket.on("getSolvingInfo", (callback) => {
    const userName = socket.data.name as string;
    const { studyId } = userMappingStudyId.get(
      socket.data.name as string
    ) as UserMapStudyType;
    const studyInfo = studyInfos.get(studyId);
    const problemInfo = studyInfo!.problems.map((problem) => ({
      ...problem,
      isSolved: problem.solvedUser.includes(userName),
    }));
    callback(problemInfo, studyInfo!.startTime + studyInfo!.duringMinute * 60);
  });

  socket.on("getResult", (callback) => {
    const { studyId } = userMappingStudyId.get(
      socket.data.name as string
    ) as UserMapStudyType;
    const studyInfo = studyInfos.get(studyId);
    callback([...studyInfo!.finishedUser, ...studyInfo!.notFinishedUser]);
  });
});
