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
import moment from "moment";
import fetch from "node-fetch";

const app = express();
app.use(
  cors({
    origin: "https://www.acmicpc.net",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded());

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
interface StudyInfoType {
  startTime: moment.Moment | null;
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
interface UserInfoType {
  name: string;
  studyId: string;
  imageUrl: string;
  studyRole: "MEMBER" | "LEADER";
}

const studyInfos = new Map<string, StudyInfoType>();
const userInfos = new Map<string, UserInfoType>();

const getUserList = async (studyId: string): Promise<UserProfileType[]> => {
  const Users = await io.in(studyId).fetchSockets();
  return Users.map((user) => ({
    name: user.data.name,
    imageUrl: user.data.imageUrl,
    studyRole: user.data.studyRole,
  }));
};

app.post("/problem/submit", (req, res) => {
  const { userId, problemNo, submitNo, code, lang } = req.body;
  const problemId = +`${problemNo}`.trim();
  console.log(userId, +problemNo, submitNo, lang, code);
  const userInfo = userInfos.get(userId);
  if (userInfo) {
    const { studyId, name, imageUrl } = userInfo;
    const problems = studyInfos.get(studyId)?.problems;
    if (problems) {
      let cnt = 0;
      problems.forEach((problem) => {
        if (problemId === problem.problemId) {
          problem.solvedUser.push(userId);
        }
        if (problem.solvedUser.includes(userId)) {
          cnt += 1;
        }
      });

      const allSol = cnt === problems.length;
      io.to(studyId).emit("solvedByExtension", userId, problemId, allSol);

      if (allSol) {
        const studyInfo = studyInfos.get(studyId);
        if (studyInfo?.startTime) {
          console.log(studyInfo.startTime.diff(moment(), "seconds"));
          studyInfo.finishedUser.push({
            name,
            imageUrl,
            problem: cnt,
            time: moment().diff(studyInfo.startTime, "seconds"),
          });

          studyInfo.notFinishedUser = studyInfo.notFinishedUser.filter(
            (user) => user.name !== name
          );
          io.to(studyId).emit("newResult", [
            ...studyInfo.finishedUser,
            ...studyInfo.notFinishedUser,
          ]);
        }
      }
    }
  }
  fetch(`https://k7c202.p.ssafy.io/api/problem/submit/study`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      submitNo,
      userId,
      problemNo,
      code,
      lang,
    }),
  });

  res.sendStatus(200);
});

io.on("connection", (socket) => {
  socket.on("enter", async (studyId, name, imageUrl, bojId, studyRole, cb) => {
    console.log(`${studyId}방에 ${name}님이 입장하셨어 boj ${bojId}`);
    socket.data.name = name;
    socket.data.bojId = bojId;
    socket.data.imageUrl = imageUrl;
    socket.data.studyRole = studyRole;
    userInfos.set(bojId, { studyId, name, imageUrl, studyRole });
    socket.join(studyId);
    socket.to(studyId).emit("addParticipant", name, imageUrl, studyRole);
    cb(await getUserList(studyId), !!studyInfos.get(studyId)?.startTime);
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
    const loginedUser = await getUserList(studyId);
    studyInfos.set(studyId, {
      startTime: moment(),
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
      const studyInfo = studyInfos.get(studyId);
      if (studyInfo) {
        studyInfo.notFinishedUser.forEach((user) => {
          studyInfo.finishedUser.push({
            ...user,
            time: studyInfo.duringMinute * 60,
          });
        });
        studyInfo.notFinishedUser = [];
        io.to(studyId).emit("newResult", [
          ...studyInfo.finishedUser,
          ...studyInfo.notFinishedUser,
        ]);
        io.to(`${studyId}`).emit("endStudy");
        studyInfo.startTime = null;
      }
    }, time * 1000 * 60);
  });

  socket.on("getSolvingInfo", (callback) => {
    console.log("getSolvingInfo");
    const bojId = socket.data.bojId as string;
    const userInfo = userInfos.get(socket.data.bojId as string);
    const studyInfo = studyInfos.get(userInfo!.studyId);
    let isAllSol = false;
    let solveCnt = 0;
    const problemInfo = studyInfo!.problems.map((problem) => {
      const isSolved = problem.solvedUser.includes(bojId);
      if (isSolved) solveCnt += 1;
      return {
        ...problem,
        isSolved,
      };
    });
    if (solveCnt === problemInfo.length) isAllSol = true;

    callback(
      problemInfo,
      studyInfo!.duringMinute * 60 -
        moment().diff(studyInfo!.startTime, "seconds"),
      isAllSol
    );
  });

  socket.on("getResult", (callback) => {
    const userInfo = userInfos.get(socket.data.bojId as string);
    const studyInfo = studyInfos.get(userInfo!.studyId);
    callback([...studyInfo!.finishedUser, ...studyInfo!.notFinishedUser]);
  });
});
