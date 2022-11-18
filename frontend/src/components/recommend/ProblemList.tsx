import React, { useEffect, useState } from "react";
import { Flex, Grid, Icon, Text } from "@chakra-ui/react";

import useToast from "hooks/useToast";
import { AiFillFolderOpen } from "react-icons/ai";
import { addWorkbook, deleteWorkbook, getWorkbook } from "../../api/workbook";
import { useAppSelector } from "../../store/hooks";
import ProblemCard from "../common/ProblemCard";
import { Problem } from "../../@types/Problem";

interface ProblemListProps {
  problemList: Problem[];
}

function ProblemList({ problemList }: ProblemListProps) {
  const auth = useAppSelector(state => state.auth);
  const [myWorkbook, setMyWorkbook] = useState<Problem[]>([]);
  const [btnTypes, setBtnTypes] = useState<("delete" | "add")[]>([]);

  const toast = useToast();

  const addProblem = async (problemId: number, idx: number) => {
    await addWorkbook(problemId);
    const newBtnTypes = [...btnTypes];
    newBtnTypes[idx] = "delete";
    setBtnTypes(newBtnTypes);
    toast({
      title: `${problemId}번 문제를 추가했습니다`,
      position: "top",
      isClosable: true
    });
  };
  const deleteProblem = async (problemId: number, idx: number) => {
    await deleteWorkbook(problemId);
    const newBtnTypes = [...btnTypes];
    newBtnTypes[idx] = "add";
    setBtnTypes(newBtnTypes);
    toast({
      title: `${problemId}번 문제를 삭제했습니다!`,
      status: "warning",
      position: "top",
      isClosable: true
    });
  };
  useEffect(() => {
    const fetch = async () => {
      const res2 = await getWorkbook();
      setMyWorkbook(res2.data);
    };
    fetch();
  }, [problemList]);
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
  }, [myWorkbook]);

  return problemList.length ? (
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
  ) : (
    <Flex
      height="500px"
      direction="column"
      justifyContent="center"
      alignItems="center"
      gap={4}
      fontSize="2xl"
      fontWeight="bold"
    >
      <Icon w="50px" h="50px" as={AiFillFolderOpen} />
      <Text>검색 결과가 없어요</Text>
    </Flex>
  );
}

export default ProblemList;
