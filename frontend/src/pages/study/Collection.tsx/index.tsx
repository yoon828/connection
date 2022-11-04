import React, { useEffect, useState } from "react";
import { Text, useDisclosure, useToast } from "@chakra-ui/react";

import StudyLayout from "../../../components/layout/StudyLayout";
import BackButton from "../../../components/common/BackButton";
import SearchModal from "../../../components/collection/SearchModal";
import {
  addWorkbook,
  deleteWorkbook,
  getWorkbook
} from "../../../api/workbook";
import { Problem } from "../../../@types/Problem";
import Style from "./index.style";
import ProblemList from "../../../components/collection/ProblemList";

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
        <Style.SearchBox onClick={onOpen}>
          <Style.SearchIcon />
          <Text>검색하기</Text>
        </Style.SearchBox>
        <ProblemList workbook={workbook} deleteProblem={deleteProblem} />
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
