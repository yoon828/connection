import {
  Button,
  Center,
  Flex,
  Highlight,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text
} from "@chakra-ui/react";
import { v4 } from "uuid";
import React, { useEffect, useMemo, useState } from "react";
import getTime from "../../utils/getTime";

type ProblemContainerProps = {
  id: number;
  title: string;
  recommendTime: number;
  times: Map<number, number>;
  setTime: (id: number, time: number) => void;
};
type TimeSetViewProps = {
  onBtnClick: () => void;
};
function ProblemContainer({
  id,
  title,
  recommendTime,
  times,
  setTime
}: ProblemContainerProps) {
  // const format = (val: number) => {
  //   if (val > 60) {
  //     return `${Math.floor(val / 60)}시간`;
  //   }
  //   return `${val}분`;
  // };
  // const parse = (val: string) => {
  //   return +val.replace("시간", "").replace("분", "");
  // };
  const format = (val: number) => `${val}분`;

  const parse = (val: string) => +val.replace("분", "");
  return (
    <Center mb="32px">
      <Flex
        alignItems="center"
        bg="dep_1"
        w="440px"
        h="72px"
        borderRadius="16px"
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
        _hover={{ background: "gra" }}
      >
        <Center borderRight="1px solid #b8b8b8" h="40px">
          <Text p="16px">{id}</Text>
        </Center>
        <Text ml="16px">{title}</Text>
      </Flex>
      <NumberInput
        min={1}
        max={180}
        value={format(times.get(id) as number)}
        onChange={value => setTime(id, parse(value))}
        borderColor="dep_1"
        ml="32px"
        bg="dep_1"
        w="100px"
        h="72px"
        borderRadius="20px"
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
        _hover={{ background: "gra", border: "transport" }}
      >
        {times.get(id) === recommendTime && (
          <Text
            pos="absolute"
            right="32px"
            zIndex="1"
            color="main"
            fontWeight="700"
          >
            추천
          </Text>
        )}
        <NumberInputField h="72px" />
        <NumberInputStepper>
          <NumberIncrementStepper />
          <NumberDecrementStepper />
        </NumberInputStepper>
      </NumberInput>
    </Center>
  );
}

function TimeSetView({ onBtnClick }: TimeSetViewProps) {
  const problemDummy = [
    { id: 1, title: "징검다리 달리기", recommendTime: 60 },
    { id: 2, title: "징검다리 달리기", recommendTime: 60 },
    { id: 3, title: "징검다리 달리기", recommendTime: 120 }
  ];
  const [times, setTimes] = useState<Map<number, number>>(new Map());

  const totalTime = useMemo(() => {
    let total = 0;
    times.forEach(time => {
      total += time;
    });
    return getTime(total * 60);
  }, [times]);

  useEffect(() => {
    const newTimesMap = new Map();
    problemDummy.forEach(problem => {
      newTimesMap.set(problem.id, problem.recommendTime);
    });
    setTimes(newTimesMap);
  }, []);

  return (
    <Center w="1200px" m="auto" flexDir="column">
      <Text fontSize="48px" fontWeight="700" mt="60px" mb="32px">
        문제 풀이 시간
      </Text>
      <Text mb="60px" fontSize="16px">
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
          우건이와 아이들 과 함께 문제를 풀 제한 시간을 설정해주세요
        </Highlight>
      </Text>
      {times &&
        problemDummy.map(problem => (
          <ProblemContainer
            key={v4()}
            title={problem.title}
            id={problem.id}
            recommendTime={problem.recommendTime}
            times={times}
            setTime={(id: number, time: number) =>
              setTimes(prev => new Map(prev).set(id, time))
            }
          />
        ))}
      <Text fontSize="60px" mb="12px">
        {totalTime}
      </Text>
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

export default TimeSetView;
