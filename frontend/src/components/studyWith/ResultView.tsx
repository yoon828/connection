import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";

import React from "react";
import getTime from "../../utils/getTime";

type ResultBarProps = {
  name: string;
  problem: number;
  time: number;
};

type ResultViewProps = {
  onBtnClick: () => void;
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

function ResultView({ onBtnClick }: ResultViewProps) {
  const dummy: ResultBarProps[] = [
    { name: "진호짱짱", problem: 2, time: 60 },
    { name: "우건공듀", problem: 2, time: 60 },
    { name: "진합왕자", problem: 2, time: 120 },
    { name: "기영왕자", problem: 2, time: 130 },
    { name: "윤민공듀", problem: 2, time: 140 },
    { name: "준우왕자", problem: 2, time: 160 }
  ];

  return (
    <Center w="1200px" m="auto" flexDir="column">
      <Text fontSize="48px" fontWeight="700" mt="48px" mb="24px">
        풀이 결과
      </Text>
      {dummy &&
        dummy.map((d, ind) => (
          <ResultBar
            key={d.name}
            rank={ind + 1}
            name={d.name}
            problem={d.problem}
            time={d.time}
            isMe={d.name === "우건공듀"}
          />
        ))}

      <Button
        w="160px"
        h="48px"
        borderRadius="16px"
        fontSize="24px"
        bg="gra"
        _hover={{ opacity: 0.6 }}
        onClick={onBtnClick}
      >
        다음
      </Button>
    </Center>
  );
}

export default ResultView;
