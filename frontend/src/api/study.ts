import axios, { AxiosError, AxiosResponse } from "axios";
import { UserListProps } from "pages/study/StudyTotal";
import api from "./api";
import { ErrMsgType } from "./studyJoin";

// 스터디 스트릭
export const getStrict = async () => {
  const res = await api.get("/study/streak");
  return res;
};

// 스터디 내 활동 현황
export const getMyActivity = async () => {
  const res = await api.get("/subject/");
  return res;
};

// 스터디 탈퇴/추방
export const quitStudy = async (userId?: number) => {
  let res;
  if (userId) res = await api.delete(`/study/quit?user_id=${userId}`);
  else res = await api.delete(`/study/quit`);
  return res;
};

// 스터디 해체
export const deleteStudy = async () => {
  const res = await api.delete(`/study`);
  return res;
};

// 스터디 랭킹
export const getRank = async () => {
  const res = await api.get("/study/ranking");
  return res;
};

// 스터디 멤버 활동 현황
export const getMember = async () => {
  const res = await api.get("/study/member");
  return res;
};

// 스터디 멤버 조회
export const getMemberList = async (): Promise<
  AxiosResponse<UserListProps[], null> | AxiosError<ErrMsgType, null>
> => {
  try {
    const res = await api.get("/study/memberlist");
    return res;
  } catch (error) {
    const e = error as AxiosError<ErrMsgType, null> | Error;
    if (axios.isAxiosError(e)) {
      return e;
    }
    throw e;
  }
};

// 스터디 팀 과제
export const getSubject = async () => {
  const res = await api.get("/subject/team");
  return res;
};
