import { createSlice } from "@reduxjs/toolkit";

import { Problem } from "../../../@types/Problem";
import { InitialStateType, ProblemActionType } from "./selectedProblem.type";
import { getMyWorkbook, getRecommends } from "./selectedProblemThunk";

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
    addProblem: (state, action: ProblemActionType) => {
      const { problemId } = action.payload.problemInfo;

      if (isExist(state.selectedProblemList, problemId)) return;

      state.selectedProblemList = [
        ...state.selectedProblemList,
        action.payload
      ];
      state.showedRecommends = [...filter(state.showedRecommends, problemId)];
      state.showedMyWorkbook = [...filter(state.showedMyWorkbook, problemId)];
      state.cnt = state.selectedProblemList.length;
    },
    removeProblem: (state, action: ProblemActionType) => {
      const { problemId } = action.payload.problemInfo;

      state.selectedProblemList = [
        ...filter(state.selectedProblemList, problemId)
      ];

      const recommendItem = state.recommends.find(
        problem => problem.problemInfo.problemId === problemId
      );
      if (recommendItem)
        state.showedRecommends = [recommendItem, ...state.showedRecommends];

      const myWorkbookItem = state.myWorkbook.find(
        problem => problem.problemInfo.problemId === problemId
      );
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
