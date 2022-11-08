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
  studyRole: string;
  studyName: string;
  studyRepository: string;
  studyCode: string;
  ismember: boolean;
}
export type UserProfileType = Pick<UserInfoType, "name" | "imageUrl">;

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
    newImageUrl: UserInfoType["imageUrl"]
  ) => void;
  removeParticipant: (targetName: UserInfoType["name"]) => void;
  endStudy: () => void;
  startSolve: () => void;
  solvedByExtension: (
    bojId: string,
    problemNo: number,
    isAllSol: boolean
  ) => void;
}

export interface ClientToServerEvents {
  enter: (
    studyId: string,
    name: UserInfoType["name"],
    imageUrl: UserInfoType["imageUrl"],
    bojId: string,
    initParticipant: (userList: UserProfileType[]) => void
  ) => void;
  startStudy: (
    studyId: string,
    problemList: Pick<ServerProblemType, "problemId" | "title" | "level">[],
    time: number,
    callback: () => void
  ) => void;
  getSolvingInfo: (
    callback: (problemList: ServerProblemType[], remainTime: number) => void
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
}

export enum PageViewState {
  NumberSet,
  ProblemSet,
  TimeSet,
  Solving,
  Result,
  Review
}
