import { AxiosResponse } from "axios";
import { api } from "./api";

export const getRecommend = async () => {
  const res = await api.get("/problem/recommend");
  return res;
};

export const searchProblem = async (keyword: string) => {
  const res = await api.get(`/problem/search?keyword=${keyword}`);
  return res;
};

export const getRecommendTimes = async (
  problemList: number[]
): Promise<AxiosResponse<{ time: { [key: number]: number } }, null>> => {
  const res = await api.get(
    `/problem/time?problemIdList=${problemList.join(",")}`
  );
  return res;
};
