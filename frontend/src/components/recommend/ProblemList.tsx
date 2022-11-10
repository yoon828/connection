import React, { useEffect, useState } from "react";
import { Grid, useToast } from "@chakra-ui/react";

import { addWorkbook, deleteWorkbook } from "../../api/workbook";
import { useAppSelector } from "../../store/hooks";
import ProblemCard from "../common/ProblemCard";
import { Problem } from "../../@types/Problem";

interface ProblemListProps {
  problemList: Problem[];
  myWorkbook: Problem[];
}

function ProblemList({ problemList, myWorkbook }: ProblemListProps) {
  const auth = useAppSelector(state => state.auth);
  const [btnTypes, setBtnTypes] = useState(
    problemList.map(problem =>
      myWorkbook.findIndex(
        p => p.problemInfo.problemId === problem.problemInfo.problemId
      ) >= 0
        ? "delete"
        : "add"
    )
  );
  const toast = useToast();

  const addProblem = async (problemId: number, idx: number) => {
    const res = await addWorkbook(problemId);
    const newBtnTypes = [...btnTypes];
    newBtnTypes[idx] = "delete";
    setBtnTypes(newBtnTypes);
    toast({
      title: `${problemId}번 문제를 추가했습니다`,
      position: "top",
      isClosable: true
    });
    console.log(problemId);
  };
  const deleteProblem = async (problemId: number, idx: number) => {
    const res = await deleteWorkbook(problemId);
    const newBtnTypes = [...btnTypes];
    newBtnTypes[idx] = "add";
    setBtnTypes(newBtnTypes);
    toast({
      title: `${problemId}번 문제를 삭제했습니다!`,
      status: "warning",
      position: "top",
      isClosable: true
    });
    console.log(problemId);
  };
  useEffect(() => {
    setBtnTypes(
      problemList.map(problem =>
        myWorkbook.findIndex(
          p => p.problemInfo.problemId === problem.problemInfo.problemId
        ) >= 0
          ? "delete"
          : "add"
      )
    );
  }, [problemList]);

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

export default ProblemList;
