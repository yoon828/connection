import React, { useState } from "react";

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useDisclosure
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

import StudyLayout from "../../components/layout/StudyLayout";
import BackButton from "../../components/common/BackButton";
import ProblemSelect from "../../components/common/ProblemSelect/ProblemSelect";
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

function Assignment() {
  const [problemList, setProblemList] = useState(dumpProblemList);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <StudyLayout
        sideComponent={<BackButton />}
        title="과제 등록"
        description="스터디원들과 같이 풀 문제와 기간을 설정해주세요."
        bg="bg"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Flex alignItems="center" gap={4}>
            <Text fontSize="lg" fontWeight="bold" flexShrink={0}>
              과제 기간
            </Text>
            <Input type="date" bg="dep_1" cursor="pointer" />
            <Text fontWeight="bold">~</Text>
            <Input type="date" bg="dep_1" cursor="pointer" />
          </Flex>
          <Box
            bg="dep_1"
            p={2}
            borderRadius="10px"
            cursor="pointer"
            onClick={onOpen}
          >
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
      <SearchModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Assignment;
