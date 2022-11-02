import { Search2Icon } from "@chakra-ui/icons";
import { Box, Button, Center, Highlight, Text } from "@chakra-ui/react";
import React from "react";
import ProblemSelect from "../common/ProblemSelect/ProblemSelect";
import NextBtn from "./NextBtn";
import ViewTitle from "./ViewTitle";

type ProblemSetViewProps = {
  onBtnClick: () => void;
};

function ProblemSetView({ onBtnClick }: ProblemSetViewProps) {
  return (
    <Center w="1200px" m="auto" flexDir="column">
      <ViewTitle
        main="문제 선택"
        mt={40}
        mb={0}
        des="우건이와 아이들 과 함께 풀이할 문제를 선택해주세요."
        highLight="우건이와 아이들"
      />
      <Box w="880px">
        <Center mb="12px">
          <Button bg="dep_2" ml="auto" borderRadius="12px" p="4px">
            <Search2Icon w="20px" h="20px" />
          </Button>
        </Center>
        <ProblemSelect maxCnt={3} />
      </Box>
      <NextBtn mt={20} onBtnClick={onBtnClick} text="다음" />
    </Center>
  );
}

export default ProblemSetView;
