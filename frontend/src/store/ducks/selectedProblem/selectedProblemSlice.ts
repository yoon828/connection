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

export const selectedProblemSlice = createSlice({
  name: "selectedProblem",
  initialState,
  reducers: {
    addProblem: (state, action) => {
      if (
        state.selectedProblemList.findIndex(
          problem =>
            problem.problemInfo.problemId ===
            action.payload.problemInfo.problemId
        ) >= 0
      )
        return;
      state.selectedProblemList = [
        ...state.selectedProblemList,
        action.payload
      ];
      state.showedRecommends = [
        ...state.showedRecommends.filter(
          problem =>
            problem.problemInfo.problemId !==
            action.payload.problemInfo.problemId
        )
      ];
      state.showedMyWorkbook = [
        ...state.showedMyWorkbook.filter(
          problem =>
            problem.problemInfo.problemId !==
            action.payload.problemInfo.problemId
        )
      ];
      state.cnt = state.selectedProblemList.length;
    },
    removeProblem: (state, action) => {
      state.selectedProblemList = [
        ...state.selectedProblemList.filter(
          problem =>
            problem.problemInfo.problemId !==
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
    reset: state => {
      state.selectedProblemList = [];
      state.recommends = [];
      state.showedRecommends = [];
      state.myWorkbook = [];
      state.showedMyWorkbook = [];
      state.selectedTab = 0;
      state.cnt = 0;
    }
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
