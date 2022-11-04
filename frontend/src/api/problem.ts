import { AxiosResponse } from "axios";

import { api } from "./api";
import { Problem, Stat } from "../@types/Problem";

export interface GetRecommendRes {
  popular: Problem[];
  workbook: Problem[];
  weak: Problem[];
  stat: Stat[];
}

export const getRecommend = async (): Promise<
  AxiosResponse<GetRecommendRes, null>
> => {
  const res = await api.get("/problem/recommend");
  return res;
};

export const searchProblem = async (keyword: string) => {
  const res = await api.get(`/problem/search?keyword=${keyword}`);
  return res;
};
