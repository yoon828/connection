interface UserInfoType {
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
/* eslint-disable no-shadow */
export interface ServerToClientEvents {
  addParticipant: (
    newName: UserInfoType["name"],
    newImageUrl: UserInfoType["imageUrl"]
  ) => void;
  removeParticipant: (targetName: UserInfoType["name"]) => void;
}

export interface ClientToServerEvents {
  chat: (msg: string) => void;
  enter: (
    studyId: UserInfoType["studyId"],
    name: UserInfoType["name"],
    imageUrl: UserInfoType["imageUrl"]
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {
  name: UserInfoType["name"];
}

export enum PageViewState {
  NumberSet,
  ProblemSet,
  TimeSet,
  Solving,
  Result,
  Review,
}
