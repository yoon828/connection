import React, { useEffect, useState } from "react";
import { Flex, Grid, Text, useDisclosure, useToast } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

import StudyLayout from "../../components/layout/StudyLayout";
import BackButton from "../../components/common/BackButton";
import ProblemCard from "../../components/common/ProblemCard";
import SearchModal from "../../components/collection/SearchModal";
import { Problem } from "../Recommend";
import { addWorkbook, deleteWorkbook, getWorkbook } from "../../api/workbook";

function Collection() {
  const [workbook, setWorkbook] = useState<Problem[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const deleteProblem = async (problemId: number) => {
    const res = await deleteWorkbook(problemId);
    setWorkbook(prevWorkbook =>
      prevWorkbook.filter(
        problem => problem.problemInfo.problemId !== problemId
      )
    );
    toast({
      title: `${problemId}번 문제를 삭제했습니다`,
      position: "top",
      isClosable: true,
      status: "warning"
    });
  };
  const addProblem = async (problem: Problem) => {
    const res = await addWorkbook(problem.problemInfo.problemId);
    setWorkbook(prevWorkbook => [...prevWorkbook, problem]);
    toast({
      title: `${problem.problemInfo.problemId}번 문제를 추가했습니다.`,
      position: "top",
      isClosable: true
    });
  };

  useEffect(() => {
    const fetch = async () => {
      const res = await getWorkbook();
      setWorkbook(res.data);
    };
    fetch();
  }, []);
  return (
    <>
      <StudyLayout
        sideComponent={<BackButton />}
        title="스터디 문제집"
        description="스터디에서 담아놓은 문제집입니다."
      >
        <Flex
          borderRadius="20px"
          w="200px"
          p="3"
          bg="dep_1"
          ml="auto"
          mb="6"
          cursor="pointer"
          gap="3"
          boxShadow="0 4px 4px rgba(0,0,0,0.25)"
          onClick={onOpen}
        >
          <Search2Icon w="6" h="6" />
          <Text fontSize="lg" fontWeight="normal">
            검색하기
          </Text>
        </Flex>
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
      </StudyLayout>
      <SearchModal
        isOpen={isOpen}
        onClose={onClose}
        maxCnt={10}
        workbook={workbook}
        deleteProblem={deleteProblem}
        addProblem={addProblem}
      />
    </>
  );
}

export default Collection;
