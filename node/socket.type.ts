export interface UserInfoType {
  userId: number;
  name: string;
  githubId: string;
  backjoonId: null | string;
  email: string;
  imageUrl: string;
  tier: number;
  role: string;
  studyId: number;
  studyRole: "MEMBER" | "LEADER";
  studyName: string;
  studyRepository: string;
  studyCode: string;
  ismember: boolean;
}
export type UserProfileType = Pick<
  UserInfoType,
  "name" | "imageUrl" | "studyRole"
>;
export interface ServerProblemType {
  problemId: number;
  title: string;
  level: number;
  isSolved: boolean;
}
/* eslint-disable no-shadow */
export interface ServerToClientEvents {
  initParticipant: (
    newName: UserInfoType["name"][],
    newImageUrl: UserInfoType["imageUrl"][]
  ) => void;
  addParticipant: (
    newName: UserInfoType["name"],
    newImageUrl: UserInfoType["imageUrl"],
    studyRole: UserInfoType["studyRole"]
  ) => void;
  removeParticipant: (targetName: UserInfoType["name"]) => void;
  endStudy: () => void;
  startSolve: () => void;
  solvedByExtension: (
    bojId: string,
    problemNo: number,
    isAllSol: boolean
  ) => void;
  newResult: (
    results: {
      name: string;
      problem: number;
      time: number | null;
      imageUrl: string;
    }[]
  ) => void;
}

export interface ClientToServerEvents {
  enter: (
    studyId: string,
    name: UserInfoType["name"],
    imageUrl: UserInfoType["imageUrl"],
    bojId: string,
    studyRole: UserInfoType["studyRole"],
    initParticipant: (userList: UserProfileType[], isStudying: boolean) => void
  ) => void;
  startStudy: (
    studyId: string,
    problemList: Pick<ServerProblemType, "problemId" | "title" | "level">[],
    time: number,
    callback: () => void
  ) => void;
  getSolvingInfo: (
    callback: (
      problemList: ServerProblemType[],
      remainTime: number,
      allSol: boolean
    ) => void
  ) => void;
  getResult: (
    callback: (
      results: {
        name: string;
        problem: number;
        time: number | null;
        imageUrl: string;
      }[]
    ) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  name: UserInfoType["name"];
  imageUrl: UserInfoType["imageUrl"];
  bojId: string;
  studyRole: UserInfoType["studyRole"];
}

export enum PageViewState {
  Waiting,
  // NumberSet,
  ProblemSet,
  TimeSet,
  Solving,
  Result,
  Review,
}
