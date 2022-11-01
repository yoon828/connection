import axios from "axios";
import { api } from "./api";

export const getUser = () => {
  return api.get("/auth/");
};

// 백준에서 푼 문제 가져오기
export const getUserProblems = (id: string, page: number) => {
  return axios.get(
    `https://solved.ac/api/v3/search/problem?query=solved_by%3A${id}&page=${page}`
  );
};
