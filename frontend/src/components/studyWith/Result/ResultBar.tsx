import { Box, Center, Flex, Text } from "@chakra-ui/react";
import React from "react";
import getTime from "../../../utils/getTime";

export type ResultBarProps = {
  name: string;
  problem: number;
  time: number;
};

function ResultBar({
  name,
  problem,
  time,
  rank,
  isMe
}: ResultBarProps & { rank: number; isMe: boolean }) {
  return (
    <Center
      w="640px"
      h="88px"
      bg={isMe ? "gra" : "dep_1"}
      borderRadius="12px"
      shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
      fontSize="20px"
      mb="20px"
      pl="8px"
    >
      <Center borderRight="1px solid #b8b8b8" w="72px" h="64px" p="16px">
        {rank}위
      </Center>
      <Box flexDir="column" p="0 16px" w="600px">
        <Box fontWeight="700">{name}</Box>
        <Flex w="320px" justifyContent="space-between">
          <Text>푼 문제수 : {problem}개</Text>
          <Text>시간 : {getTime(time)}</Text>
        </Flex>
      </Box>
    </Center>
  );
}

export default ResultBar;
