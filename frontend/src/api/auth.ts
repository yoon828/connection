import axios from "axios";
import { api } from "./api";

export const getUser = async () => {
  const res = api.get("/auth/");
  return res;
};

// 백준에서 푼 문제 가져오기
export const getUserProblems = async (id: string, page: number) => {
  const res = await axios.get(
    `https://solved.ac/api/v3/search/problem?query=solved_by%3A${id}&page=${page}`
  );
  return res;
};
