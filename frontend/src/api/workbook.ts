import { api } from "./api";

export const addWorkbook = async (problemId: number) => {
  const res = await api.post(`/workbook?problemId=${problemId}`);
  return res;
};

export const deleteWorkbook = async (problemId: number) => {
  const res = await api.delete(`/workbook?problemId=${problemId}`);
  return res;
};

export const getWorkbook = async () => {
  const res = await api.get(`/workbook`);
  return res.data;
};
