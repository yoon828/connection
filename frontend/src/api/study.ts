import api from "./api";

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

// 스터디 랭킹
export const getRank = async () => {
  const res = await api.get("/study/ranking");
  return res;
};

// 스터디 팀 과제
export const getSubject = async () => {
  const res = await api.get("/subject/team");
  return res;
};
