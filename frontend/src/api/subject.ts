import { api } from "./api";

export interface SubjectBody {
  deadline: string;
  problemList: number[];
}
export const postSubject = async (body: SubjectBody) => {
  const res = await api.post("/subject", body);
  return res;
};

export const searchProblem = async (keyword: string) => {
  const res = await api.get(`/problem/search?keyword=${keyword}`);
  return res;
};
