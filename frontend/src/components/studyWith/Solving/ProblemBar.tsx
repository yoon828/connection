import { Button, Center, Flex } from "@chakra-ui/react";
import React, { useMemo, useState } from "react";

export interface ProblemBarProps {
  problemId: number;
  title: string;
  isSolved: boolean;
}

function ProblemBar({ problemId, title, isSolved }: ProblemBarProps) {
  return (
    <Center
      w="700px"
      h="64px"
      bg="dep_1"
      borderRadius="12px"
      shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
      fontSize="20px"
      mb="20px"
      _hover={{ background: "gra" }}
    >
      <Center borderRight="1px solid #b8b8b8" w="100px" h="48px" p="0 16px">
        {problemId}
      </Center>
      <Flex
        borderRight="1px solid #b8b8b8"
        w="500px"
        h="48px"
        p="0 16px"
        justify="space-between"
      >
        <Center>{title}</Center>
        <Center>
          <Button
            bg="transparent"
            _hover={{ background: "transparent" }}
            onClick={() =>
              window.open(`https://www.acmicpc.net/problem/${problemId}`)
            }
          >
            문제풀기
          </Button>
        </Center>
      </Flex>
      {/* <Center borderRight="1px solid #b8b8b8">
        <Button
          bg="transparent"
          _hover={{ background: "transparent" }}
          m="0 8px"
        >
          제출 확인
        </Button>
      </Center> */}

      <Center p="0 16px" w="100px">
        <Center
          borderRadius={50}
          w="20px"
          h="20px"
          bg={isSolved ? "gra" : "red_lin"}
        />
      </Center>
    </Center>
  );
}

export default ProblemBar;
