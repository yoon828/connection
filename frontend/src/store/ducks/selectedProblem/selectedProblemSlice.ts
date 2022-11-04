import { createSlice } from "@reduxjs/toolkit";

import { Problem } from "../../../pages/Recommend";
import { getMyWorkbook, getRecommends } from "./selectedProblemThunk";

interface InitialStateType {
  selectedProblemList: Problem[];
  recommends: Problem[];
  showedRecommends: Problem[];
  myWorkbook: Problem[];
  showedMyWorkbook: Problem[];
  selectedTab: number;
  cnt: number;
}

const initialState: InitialStateType = {
  selectedProblemList: [],
  recommends: [],
  showedRecommends: [],
  myWorkbook: [],
  showedMyWorkbook: [],
  selectedTab: 0,
  cnt: 0
};

const filter = (list: Problem[], problemId: number) =>
  list.filter(problem => problem.problemInfo.problemId !== problemId);

const isExist = (list: Problem[], problemId: number) =>
  list.findIndex(problem => problem.problemInfo.problemId === problemId) >= 0;

export const selectedProblemSlice = createSlice({
  name: "selectedProblem",
  initialState,
  reducers: {
    addProblem: (state, action) => {
      if (
        isExist(state.selectedProblemList, action.payload.problemInfo.problemId)
      )
        return;
      state.selectedProblemList = [
        ...state.selectedProblemList,
        action.payload
      ];
      state.showedRecommends = [
        ...filter(state.showedRecommends, action.payload.problemInfo.problemId)
      ];
      state.showedMyWorkbook = [
        ...filter(state.showedMyWorkbook, action.payload.problemInfo.problemId)
      ];
      state.cnt = state.selectedProblemList.length;
    },
    removeProblem: (state, action) => {
      state.selectedProblemList = [
        ...filter(
          state.selectedProblemList,
          action.payload.problemInfo.problemId
        )
      ];
      const recommendItem = state.recommends.find(
        problem =>
          problem.problemInfo.problemId === action.payload.problemInfo.problemId
      );
      const myWorkbookItem = state.myWorkbook.find(
        problem =>
          problem.problemInfo.problemId === action.payload.problemInfo.problemId
      );
      if (recommendItem)
        state.showedRecommends = [recommendItem, ...state.showedRecommends];
      if (myWorkbookItem)
        state.showedMyWorkbook = [myWorkbookItem, ...state.showedMyWorkbook];
      state.cnt = state.selectedProblemList.length;
    },
    reset: () => initialState
  },
  extraReducers: builder => {
    builder.addCase(getRecommends.fulfilled, (state, { payload }) => {
      state.recommends = [...payload.popular, ...payload.workbook];
      state.showedRecommends = [...payload.popular, ...payload.workbook];
    });
    builder.addCase(getMyWorkbook.fulfilled, (state, { payload }) => {
      state.myWorkbook = payload;
      state.showedMyWorkbook = payload;
    });
    builder.addCase(getMyWorkbook.rejected, state => {
      state.myWorkbook = [];
      state.showedMyWorkbook = [];
    });
  }
});

export const { addProblem, removeProblem, reset } =
  selectedProblemSlice.actions;

export default selectedProblemSlice.reducer;
