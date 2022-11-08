import { Grid } from "@chakra-ui/react";
import React from "react";
import { Problem } from "../../@types/Problem";
import ProblemCard from "../common/ProblemCard";

interface ProblemListProps {
  workbook: Problem[];
  deleteProblem: (problemId: number) => void;
}

function ProblemList({ workbook, deleteProblem }: ProblemListProps) {
  return (
    <Grid templateColumns="repeat(2,1fr)" gap="32px">
      {workbook.map(problem => (
        <ProblemCard
          key={problem.problemInfo.problemId}
          problem={problem}
          btnType="delete"
          onBtnClick={() => deleteProblem(problem.problemInfo.problemId)}
        />
      ))}
    </Grid>
  );
}

export default ProblemList;
