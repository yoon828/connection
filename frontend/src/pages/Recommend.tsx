import React, { useEffect, useState } from "react";
import { Grid } from "@chakra-ui/react";

import ProblemCard from "../components/common/ProblemCard";
import StudyLayout from "../components/layout/StudyLayout";
import SideComponent from "../components/recommend/SideComponent";
import { getRecommend } from "../api/problem";
import { addWorkbook, deleteWorkbook, getWorkbook } from "../api/workbook";

const TABS = [
  {
    id: 0,
    label: "많이 푼 문제",
    msg: "자주 출제되는 유형 중/다른 사람들이 많이 푼 문제들을 추천해 줄게요. "
  },
  {
    id: 1,
    label: "많이 담은 문제",
    msg: "어떤 문제를 같이 풀지 모르겠어요?/다른 스터디가 문제집에 담아놓은 문제들을 추천해 줄게요. "
  }
];

export interface Tab {
  id: number;
  label: string;
}
interface Tag {
  tagId: string;
  en: string;
  ko: string;
}

interface ProblemInfo {
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

interface RecommendsType {
  popular: Problem[];
  workbook: Problem[];
}

interface ProblemListProps {
  problemList: Problem[];
}

function ProblemList({ problemList }: ProblemListProps) {
  const [myWorkbook, setMyWorkbook] = useState<Problem[]>([]);
  const [btnTypes, setBtnTypes] = useState(
    problemList.map(problem =>
      myWorkbook.findIndex(
        p => p.problemInfo.problemId === problem.problemInfo.problemId
      ) >= 0
        ? "delete"
        : "add"
    )
  );

  const addProblem = async (problemId: number, idx: number) => {
    const res = await addWorkbook(problemId);
    const newBtnTypes = [...btnTypes];
    newBtnTypes[idx] = "delete";
    setBtnTypes(newBtnTypes);
    console.log(problemId);
  };
  const deleteProblem = async (problemId: number, idx: number) => {
    const res = await deleteWorkbook(problemId);
    const newBtnTypes = [...btnTypes];
    newBtnTypes[idx] = "add";
    setBtnTypes(newBtnTypes);
    console.log(problemId);
  };
  useEffect(() => {
    const fetch = async () => {
      const res = await getWorkbook();
      setMyWorkbook(res.data);
    };
    fetch();
  }, []);
  // todo : 내 스터디 문제집에 있는 문제면 btnType을 delete로 바꾸고 onBtnClick핸들러도 문제집에서 삭제하는걸로 바꿔야됨
  // todo : add 혹은 delete 마다 problemList 상태 업데이트 해야함.
  return (
    <Grid templateColumns="repeat(2,1fr)" gap="32px">
      {problemList.map((problem, idx) => (
        <ProblemCard
          key={problem.problemInfo.problemId}
          problem={problem}
          btnType={btnTypes[idx]}
          onBtnClick={() => {
            if (btnTypes[idx] === "add")
              addProblem(problem.problemInfo.problemId, idx);
            else deleteProblem(problem.problemInfo.problemId, idx);
          }}
        />
      ))}
    </Grid>
  );
}

function Recommend() {
  const [recommends, setRecommends] = useState<null | RecommendsType>(null);
  const [selectedTap, setSelectedTap] = useState(0);

  const onTabClick: React.MouseEventHandler<HTMLDivElement> = e => {
    if (e.target instanceof HTMLDivElement && e.target.dataset.id) {
      const targetId = Number(e.target.dataset.id);
      setSelectedTap(targetId);
    }
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await getRecommend();
      setRecommends(res.data);
      console.log(res);
    };
    fetch();
  }, []);

  return (
    <StudyLayout
      sideComponent={
        <SideComponent
          tabs={TABS}
          selectedTap={selectedTap}
          onTabClick={onTabClick}
        />
      }
      title={TABS[selectedTap].label}
      description={TABS[selectedTap].msg}
    >
      {recommends && (
        <ProblemList
          problemList={
            selectedTap === 0 ? recommends?.popular : recommends?.workbook
          }
        />
      )}
    </StudyLayout>
  );
}
export default Recommend;
