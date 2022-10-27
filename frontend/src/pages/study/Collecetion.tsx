import React, { useState } from "react";
import { Flex, Grid, Text, useDisclosure } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

import StudyLayout from "../../components/layout/StudyLayout";
import BackButton from "../../components/common/BackButton";
import ProblemCard from "../../components/common/ProblemCard";
import SearchModal from "../../components/common/SearchModal";

const dumpProblemList = [
  {
    id: 123,
    title: "징검다리 건너기",
    difficulty: "골드 3",
    elapsedTime: "1:10:23",
    link: "http://asasfasf.com",
    tags: [{ id: 0, title: "#dfs" }]
  },
  {
    id: 12,
    title: "징검다리 건너기",
    difficulty: "골드 3",
    elapsedTime: "1:10:23",
    link: "http://asasfasf.com",
    tags: [{ id: 0, title: "#dfs" }]
  },
  {
    id: 3,
    title: "징검다리 건너기",
    difficulty: "골드 3",
    elapsedTime: "1:10:23",
    link: "http://asasfasf.com",
    tags: [{ id: 0, title: "#dfs" }]
  }
];

function Collection() {
  const [problemList, setProblemList] = useState(dumpProblemList);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const deleteProblem = (problemId: number) => {
    // todo : 확인하는 로직 추후 구현 필요?
    setProblemList(prevProblemList =>
      prevProblemList.filter(problem => problem.id !== problemId)
    );
  };

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
          {problemList.map(problem => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              btnType="delete"
              onBtnClick={() => deleteProblem(problem.id)}
            />
          ))}
        </Grid>
      </StudyLayout>
      <SearchModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Collection;
