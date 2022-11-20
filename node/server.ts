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
  ServerProblemType,
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

httpServer.listen(8000, () => {});

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
  users: {
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

const getSolvingInfo = (
  studyId: string,
  bojId: string
): { problemList: ServerProblemType[]; isAllSol: boolean } => {
  const studyInfo = getStudyInfo(studyId);
  let isAllSol = false;
  let solveCnt = 0;
  const problemList = studyInfo!.problems.map((problem) => {
    const isSolved = problem.solvedUser.includes(bojId);
    if (isSolved) solveCnt += 1;
    return {
      ...problem,
      isSolved,
    };
  });
  if (solveCnt === problemList.length) isAllSol = true;

  return { problemList, isAllSol };
};

const getStudyInfo = (studyId: string): StudyInfoType => {
  const studyInfo = studyInfos.get(studyId);
  if (studyInfo) return studyInfo;
  throw new Error(`ID : ${studyId} 가 존재하지 않습니다.`);
};

const getUserInfo = (bojId: string): UserInfoType => {
  const userInfo = userInfos.get(bojId);
  if (userInfo) return userInfo;
  throw new Error(`BOJ_ID : ${bojId} 가 존재하지 않습니다.`);
};

const sortStudyInfoUsers = (studyId: string) => {
  const studyInfo = getStudyInfo(studyId);
  studyInfo.users.sort((a, b) =>
    a.problem !== b.problem
      ? b.problem - a.problem
      : (a.time || 0) - (b.time || 0)
  );
};

app.post("/problem/submit", (req, res) => {
  const { userId, problemNo, submitNo, code, lang } = req.body;
  const problemId = +`${problemNo}`.trim();
  const userInfo = getUserInfo(userId);
  const { studyId, name } = userInfo;
  const problems = getStudyInfo(studyId).problems;
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

    const studyInfo = getStudyInfo(studyId);
    studyInfo.users.forEach((user) => {
      if (user.name === name) {
        user.problem = cnt;
      }
    });

    sortStudyInfoUsers(studyId);

    const { problemList, isAllSol } = getSolvingInfo(studyId, userId);
    io.to(studyId).emit("solvedByExtension", userId, problemList, isAllSol);

    if (isAllSol) {
      if (studyInfo?.startTime) {
        studyInfo.users.forEach((user) => {
          if (user.name === name) {
            user.time = moment().diff(studyInfo.startTime, "seconds");
          }
        });
        sortStudyInfoUsers(studyId);
        io.to(studyId).emit("newResult", [...studyInfo.users]);
      }
    }
    problems.forEach((problem) => {
      if (problem.problemId === problemId) {
        fetch(`https://k7c202.p.ssafy.io/api/problem/submit/study`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            submitNo,
            userId,
            problemNo: problemId,
            code,
            lang,
          }),
        });
      }
    });
  }

  res.sendStatus(200);
});

io.on("connection", (socket) => {
  socket.on("enter", async (studyId, name, imageUrl, bojId, studyRole, cb) => {
    socket.data = { name, bojId, imageUrl, studyRole };
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

  socket.on("startStudy", async (studyId, problemList, time, callback) => {
    const loginedUser = await getUserList(studyId);
    studyInfos.set(studyId, {
      startTime: moment(),
      problems: problemList.map((problem) => ({ ...problem, solvedUser: [] })),
      duringMinute: time,
      users: loginedUser.map((user) => ({
        ...user,
        problem: 0,
        time: null,
      })),
    });

    io.to(`${studyId}`).emit("startSolve");

    setTimeout(() => {
      const studyInfo = getStudyInfo(studyId);
      if (studyInfo) {
        studyInfo.users = studyInfo.users.map((user) => {
          if (!user.time) {
            return { ...user, time: studyInfo.duringMinute * 60 };
          }
          return user;
        });
        io.to(studyId).emit("newResult", [...studyInfo.users]);
        io.to(`${studyId}`).emit("endStudy");
        studyInfo.startTime = null;
      }
    }, time * 1000 * 60);
  });

  socket.on("getSolvingInfo", (callback) => {
    const bojId = socket.data.bojId as string;
    const userInfo = getUserInfo(socket.data.bojId as string);
    const studyInfo = getStudyInfo(userInfo!.studyId);
    const { problemList, isAllSol } = getSolvingInfo(userInfo!.studyId, bojId);
    callback(
      problemList,
      studyInfo!.duringMinute * 60 -
        moment().diff(studyInfo!.startTime, "seconds"),
      isAllSol
    );
  });

  socket.on("getResult", (callback) => {
    const userInfo = getUserInfo(socket.data.bojId as string);
    const studyInfo = getStudyInfo(userInfo!.studyId);
    callback([...studyInfo!.users]);
  });
});
