export interface Tag {
  tagId: string;
  en: string;
  ko: string;
}

export interface ProblemInfo {
  problemId: number;
  title: string;
  solvable: true;
  accepted: number;
  level: number;
  tries: string;
}

export interface Problem {
  problemInfo: ProblemInfo;
  tagList: Tag[];
  difficulty: number;
}

export interface Stat {
  type: string;
  cnt: number;
}
