import { Search2Icon } from "@chakra-ui/icons";
import { Box, Button, Center, Highlight, Text } from "@chakra-ui/react";
import React from "react";
import ProblemSelect from "../common/ProblemSelect/ProblemSelect";

type ProblemSetViewProps = {
  onBtnClick: () => void;
};

function ProblemSetView({ onBtnClick }: ProblemSetViewProps) {
  return (
    <Center w="1200px" m="auto" flexDir="column">
      <Text fontSize="48px" fontWeight="700" mt="40px" mb="12px">
        문제 선택
      </Text>
      <Text fontSize="16px">
        <Highlight
          query="우건이와 아이들"
          styles={{
            px: "2",
            py: "1",
            rounded: "full",
            fontWeight: 600,
            bg: "gra",
            color: "chakra-body-text"
          }}
        >
          우건이와 아이들 과 함께 풀이할 문제를 선택해주세요.
        </Highlight>
      </Text>
      <Box w="880px">
        <Center mb="12px">
          <Button bg="dep_2" ml="auto" borderRadius="12px" p="4px">
            <Search2Icon w="20px" h="20px" />
          </Button>
        </Center>
        <ProblemSelect
          problemList={[
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
          ]}
          selectedProblems={[
            { no: 1, title: "징검다리 건너기" },
            { no: 2, title: "징검다리 건너기" },
            { no: 3, title: "징검다리 건너기" }
          ]}
        />
      </Box>
      <Button
        w="160px"
        h="48px"
        borderRadius="16px"
        fontSize="24px"
        bg="gra"
        _hover={{ opacity: 0.6 }}
        _active={{ opacity: 1 }}
        onClick={onBtnClick}
        mt="20px"
      >
        다음
      </Button>
    </Center>
  );
}

export default ProblemSetView;
