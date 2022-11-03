import { UserInfoType } from "../../store/ducks/auth/auth.type";
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
  Review
}
