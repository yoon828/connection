import { Box, Center, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import React from "react";
import { v4 } from "uuid";
import getMedalColor from "../../../utils/getMedalColor";
import getTime from "../../../utils/getTime";

export type ResultBarProps = {
  imageUrl: string;
  name: string;
  problem: number;
  time: number | null;
};

function ResultBar({
  name,
  problem,
  time,
  rank,
  isMe,
  imageUrl
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
      opacity={time ? 1 : 0.55}
    >
      {time && rank <= 3 ? (
        <Image src={getMedalColor(rank)} w="96px" h="96px" mb="6px" pb="12px" />
      ) : (
        <Center w="96px" h="64px" p="16px" borderRight="1px solid #b8b8b8">
          {time ? `${rank}위` : "-"}
        </Center>
      )}
      <Tooltip key={v4()} label={name}>
        <Image
          ml="12px"
          src={imageUrl}
          borderRadius="50px"
          minW="35px"
          w="35px"
        />
      </Tooltip>
      <Box flexDir="column" p="0 16px" w="501px">
        <Box fontWeight="700">{name}</Box>
        {time ? (
          <Flex w="320px" justifyContent="space-between">
            <Text>푼 문제수 : {problem}개</Text>
            <Text>시간 : {getTime(time)}</Text>
          </Flex>
        ) : (
          <Text>진행중</Text>
        )}
      </Box>
    </Center>
  );
}

export default ResultBar;
