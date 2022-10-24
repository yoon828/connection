import React, { useState } from "react";

import { Box, Button, Flex, Grid, Icon, Input, Text } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { HiMinusCircle } from "react-icons/hi";

import StudyLayout from "../../components/layout/StudyLayout";
import BackButton from "../../components/common/BackButton";
import ProblemCard from "../../components/common/ProblemCard";
import ProblemSelect from "../../components/common/ProblemSelect/ProblemSelect";

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

function Assignment() {
  const [problemList, setProblemList] = useState(dumpProblemList);
  return (
    <StudyLayout
      sideComponent={<BackButton />}
      title="과제 등록"
      description="스터디원들과 같이 풀 문제와 기간을 설정해주세요."
      bg="dep_1"
    >
      <Flex justifyContent="space-between" alignItems="center" mb={8}>
        <Flex alignItems="center" gap={4}>
          <Text fontSize="lg" fontWeight="bold" flexShrink={0}>
            과제 기간
          </Text>
          <Input type="date" bg="dep_2" />
          <Text fontWeight="bold">~</Text>
          <Input type="date" bg="dep_2" />
        </Flex>
        <Box bg="dep_2" p={2} borderRadius="10px" cursor="pointer">
          <Search2Icon w={6} h={6} />
        </Box>
      </Flex>
      <ProblemSelect
        problemList={problemList}
        selectedProblems={[
          { no: 1, title: "징검다리 건너기" },
          { no: 2, title: "징검다리 건너기" },
          { no: 3, title: "징검다리 건너기" }
        ]}
      />
      <Box mt={4} ml="auto" w="fit-content">
        <Button
          bg="gra"
          _hover={{ transform: "scale(1.05)" }}
          _active={{ transform: "scale(1.05)" }}
        >
          등록하기
        </Button>
      </Box>
    </StudyLayout>
  );
}

export default Assignment;
