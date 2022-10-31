import API from "./index";

export const addWorkbook = async (problemId: number) => {
  const res = await API.post(`/workbook?problemId=${problemId}`);
  return res;
};

export const deleteWorkbook = async (problemId: number) => {
  const res = await API.delete(`/workbook?problemId=${problemId}`);
  return res;
};

export const getWorkbook = async () => {
  const res = await API.get(`/workbook`);
  return res;
};
