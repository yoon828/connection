import axios from "axios";
import { api } from "./api";

type BjProps = {
  baekjoonId: string;
  code: string;
};

type SolvedProps = {
  list: number[];
};

export const getUser = async () => {
  const res = await api.get("/auth/");
  return res;
};

// 백준 연동 확인
export const postBJConfirm = async (payload: BjProps) => {
  const { data } = await api.post(`/auth/baekjoon`, payload);
  return data;
};

// 백준에서 푼 문제 가져오기
export const getUserProblems = async (id: string, page: number) => {
  const res = await axios.get(
    `https://solved.ac/api/v3/search/problem?query=solved_by%3A${id}&page=${page}`
  );
  return res;
};

// 백준에서 푼 문제 보내기
export const postBJSolved = async (payload: SolvedProps) => {
  const { data } = await api.post(`/problem/register`, payload);
  return data;
};

// 깃허브 연동 확인
export const postGithubConfirm = async () => {
  const data = await api.get(`/organization`);
  return data;
};
