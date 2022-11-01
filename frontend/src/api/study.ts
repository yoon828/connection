import api from "./api";

// 스터디 스트릭
export const getStrict = async () => {
  const res = await api.get("/study");
  return res;
};
export const getUser3 = async () => {
  const res = await api.get("/auth/");
  return res;
};
