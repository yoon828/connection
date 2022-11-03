import React, { useEffect, useState } from "react";
import { Box, Grid } from "@chakra-ui/react";

import { QuestionIcon } from "@chakra-ui/icons";
import ProblemCard from "../components/common/ProblemCard";
import StudyLayout from "../components/layout/StudyLayout";
import SideComponent from "../components/recommend/SideComponent";
import { getRecommend } from "../api/problem";
import { addWorkbook, deleteWorkbook, getWorkbook } from "../api/workbook";
import { useAppSelector } from "../store/hooks";

const TABS = [
  {
    id: 0,
    label: "많이 푼 문제",
    msg: "자주 출제되는 유형 중/다른 사람들이 많이 푼 문제들을 추천해 줄게요. ",
    category: "popular"
  },
  {
    id: 1,
    label: "많이 담은 문제",
    msg: "어떤 문제를 같이 풀지 모르겠어요?/다른 스터디가 문제집에 담아놓은 문제들을 추천해 줄게요. ",
    category: "workbook"
  },
  {
    id: 2,
    label: "많이 안 푼 유형",
    msg: "자주 출제되는 유형 중/많이 안 푼 유형의 문제들을 추천해 줄게요. ",
    category: "weak"
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

interface Stat {
  type: string;
  cnt: number;
}
interface RecommendsType {
  popular: Problem[];
  workbook: Problem[];
  weak: Problem[];
  stat: Stat[];
}

interface ProblemListProps {
  problemList: Problem[];
}

function ProblemList({ problemList }: ProblemListProps) {
  const auth = useAppSelector(state => state.auth);
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

  return (
    <Grid templateColumns="repeat(2,1fr)" gap="32px">
      {problemList.map((problem, idx) => (
        <ProblemCard
          key={problem.problemInfo.problemId}
          problem={problem}
          btnType={btnTypes[idx]}
          hasBtn={auth.information.studyId !== 0}
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
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const onTabClick: React.MouseEventHandler<HTMLDivElement> = e => {
    if (e.target instanceof HTMLDivElement && e.target.dataset.id) {
      const targetId = Number(e.target.dataset.id);
      setSelectedTap(targetId);
    }
  };
  const showTooltip = () => {
    setTooltipOpen(true);
  };
  const hideTooltip = () => {
    setTooltipOpen(false);
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
      {TABS[selectedTap].category === "weak" && (
        <>
          <QuestionIcon
            w={10}
            h={10}
            color="dep_1"
            position="absolute"
            borderRadius="50%"
            shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
            top={10}
            right={12}
            cursor="help"
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
          />
          <Box
            position="absolute"
            display={`${tooltipOpen ? "block" : "none"}`}
            bg="dep_1"
            top={20}
            right={12}
            p={4}
            shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
          >
            {recommends?.stat.slice(0, 5).map(v => `${v.type} : ${v.cnt} `)}
          </Box>
        </>
      )}
      {recommends && (
        <ProblemList
          problemList={
            recommends[
              TABS[selectedTap].category as keyof RecommendsType
            ] as Problem[]
          }
        />
      )}
    </StudyLayout>
  );
}
export default Recommend;
