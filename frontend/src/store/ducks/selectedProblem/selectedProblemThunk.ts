import { createAsyncThunk } from "@reduxjs/toolkit";
import { getRecommend } from "../../../api/problem";
import { getWorkbook } from "../../../api/workbook";

export const getRecommends = createAsyncThunk(
  "selectedProblem/getRecommends",
  async () => {
    const res = await getRecommend();
    return res.data;
  }
);

export const getMyWorkbook = createAsyncThunk(
  "selectedProblem/getMyWorkbook",
  async () => {
    const res = await getWorkbook();
    return res.data;
  }
);
