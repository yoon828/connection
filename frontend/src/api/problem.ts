import API from "./index";

export const getRecommend = async () => {
  const res = await API.get("/problem/recommend");
  return res;
};

export const test = async () => {
  const res = await API.get("/problem/recommend");
  return res;
};
