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
