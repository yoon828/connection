import { Problem } from "../../../@types/Problem";

export interface InitialStateType {
  selectedProblemList: Problem[];
  recommends: Problem[];
  showedRecommends: Problem[];
  myWorkbook: Problem[];
  showedMyWorkbook: Problem[];
  selectedTab: number;
  cnt: number;
}

export interface ProblemActionType {
  type: string;
  payload: Problem;
}
