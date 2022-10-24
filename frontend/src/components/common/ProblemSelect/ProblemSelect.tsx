import React from "react";
import { Box, chakra, Flex, Grid } from "@chakra-ui/react";
import ProblemCard, { Problem } from "../ProblemCard";
import SelectedProblem from "./SelectedProblem";

export interface selectedProblem {
  no: number;
  title: string;
}

interface ProblemSelectProps {
  selectedProblems?: selectedProblem[];
  problemList: Problem[];
}

const Tab = chakra(Box, {
  baseStyle: {
    p: 3,
    bg: "gra",
    w: "full",
    borderTopRadius: "20px",
    textAlign: "center",
    cursor: "pointer"
  }
});

function ProblemSelect({ selectedProblems, problemList }: ProblemSelectProps) {
  return (
    <Grid templateColumns="repeat(2,1fr)" gap="32px">
      <Flex direction="column" alignItems="center">
        <Box p={3} bg="gra" w="full" borderTopRadius="20px" textAlign="center">
          선택한 문제
        </Box>
        <Flex
          w="full"
          bg="dep_2"
          direction="column"
          alignItems="center"
          h="500px"
          px={8}
          py={8}
          gap={4}
        >
          {selectedProblems?.map(problem => (
            <SelectedProblem
              key={problem.no}
              no={problem.no}
              title={problem.title}
              onDeleteHandler={() => {
                console.log(`${problem.no} 삭제`);
              }}
            />
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" alignItems="center">
        <Flex w="full">
          <Tab>추천 문제</Tab> <Tab>문제집</Tab>
        </Flex>
        <Flex
          w="full"
          bg="dep_2"
          h="500px"
          direction="column"
          p={8}
          gap={8}
          overflowY="scroll"
        >
          {problemList.map(problem => (
            <ProblemCard
              key={problem.id}
              bg="dep_3"
              problem={problem}
              btnType="delete"
              onBtnClick={() => console.log(problem.id)}
            />
          ))}
        </Flex>
      </Flex>
    </Grid>
  );
}

ProblemSelect.defaultProps = {
  selectedProblems: []
};

export default ProblemSelect;
