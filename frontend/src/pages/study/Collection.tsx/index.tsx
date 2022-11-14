import React, { useEffect, useState } from "react";
import { Flex, Icon, Text, useDisclosure } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AiFillFolderOpen } from "react-icons/ai";

import useToast from "hooks/useToast";
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
        {workbook.length > 0 ? (
          <ProblemList workbook={workbook} deleteProblem={deleteProblem} />
        ) : (
          <Flex
            h="300px"
            direction="column"
            justifyContent="center"
            alignItems="center"
            fontSize="2xl"
            fontWeight="bold"
          >
            <Link to="/recommend">
              <Flex
                direction="column"
                alignItems="center"
                gap="10px"
                _hover={{ opacity: 0.7 }}
                cursor="pointer"
              >
                <Icon w="50px" h="50px" as={AiFillFolderOpen} />
                <Text>문제집이 비어있어요</Text>
              </Flex>
            </Link>
          </Flex>
        )}
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
