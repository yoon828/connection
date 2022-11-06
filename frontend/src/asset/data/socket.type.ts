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

export interface ProblemType {
  problemId: number;
  title: string;
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
}

export interface ClientToServerEvents {
  enter: (
    studyId: UserInfoType["studyId"],
    name: UserInfoType["name"],
    imageUrl: UserInfoType["imageUrl"],
    initParticipant: (userList: UserProfileType[]) => void
  ) => void;
  startStudy: (
    studyId: UserInfoType["studyId"],
    problemList: Pick<ProblemType, "problemId" | "title">[],
    time: number,
    callback: () => void
  ) => void;
  getSolvingInfo: (
    callback: (problemList: ProblemType[], endTime: number) => void
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  name: UserInfoType["name"];
  imageUrl: UserInfoType["imageUrl"];
}

export enum PageViewState {
  NumberSet,
  ProblemSet,
  TimeSet,
  Solving,
  Result,
  Review
}
