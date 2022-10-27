import {
  Box,
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
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import getTime from "../../utils/getTime";
import ViewTitle from "./ViewTitle";
import NextBtn from "./NextBtn";

type ProblemContainerProps = {
  id: number;
  title: string;
  recommendTime: number;
  setTimes: (id: number, time: number) => void;
};
type TimeSetViewProps = {
  onBtnClick: () => void;
  onPrevBtnClick: () => void;
};

function ProblemContainer({
  id,
  title,
  recommendTime,
  setTimes
}: ProblemContainerProps) {
  const format = (val: number) => `${val}분`;
  const parse = (val: string) => +val.replace("분", "");
  const [time, setTime] = useState(recommendTime);

  return (
    <Center mb="32px">
      <Flex
        alignItems="center"
        bg="dep_1"
        w="440px"
        h="72px"
        borderRadius="16px"
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
      >
        <Center borderRight="1px solid #b8b8b8" h="40px">
          <Text p="16px">{id}</Text>
        </Center>
        <Text ml="16px">{title}</Text>
      </Flex>
      <NumberInput
        min={1}
        max={180}
        value={format(time)}
        onChange={value => {
          setTime(parse(value));
          setTimes(id, parse(value));
        }}
        borderColor="dep_1"
        ml="32px"
        bg="dep_1"
        w="100px"
        h="72px"
        borderRadius="20px"
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
      >
        <NumberInputField h="72px" />
        <NumberInputStepper>
          <NumberIncrementStepper _hover={{ background: "gra" }} />
          <NumberDecrementStepper _hover={{ background: "gra" }} />
        </NumberInputStepper>
      </NumberInput>
      <Text ml="12px">
        <Highlight
          query={`${recommendTime}분 추천`}
          styles={{
            px: "4",
            py: "1",
            rounded: "full",
            fontWeight: 500,
            bg: "gra",
            color: "chakra-body-text"
          }}
        >
          {`${recommendTime}분 추천`}
        </Highlight>
      </Text>
    </Center>
  );
}
const MemoProblemContainer = React.memo(ProblemContainer);

function TimeSetView({ onBtnClick, onPrevBtnClick }: TimeSetViewProps) {
  const problemDummy = [
    { id: 1, title: "징검다리 달리기", recommendTime: 60 },
    { id: 2, title: "징검다리 달리기", recommendTime: 60 },
    { id: 3, title: "징검다리 달리기", recommendTime: 120 }
  ];
  const [times, setTimes] = useState<Map<number, number>>(new Map());

  const totalTime = useMemo(() => {
    let total = 0;
    let flag = false;
    times.forEach(time => {
      if (time > 180) {
        flag = true;
      }
      total += time;
    });
    if (flag) return "문제당 최대 3시간으로 설정해주세요";
    return getTime(total * 60);
  }, [times]);

  const handleTimes = useCallback(
    (id: number, time: number) => setTimes(prev => new Map(prev).set(id, time)),
    []
  );

  useEffect(() => {
    const newTimesMap = new Map();
    problemDummy.forEach(problem => {
      newTimesMap.set(problem.id, problem.recommendTime);
    });
    setTimes(newTimesMap);
  }, []);

  return (
    <Center w="1200px" m="auto" flexDir="column">
      <Box w="800px" pos="absolute" top="108px">
        <ArrowBackIcon
          w="32px"
          h="32px"
          cursor="pointer"
          onClick={onPrevBtnClick}
        />
      </Box>

      <ViewTitle
        main="문제 풀이 시간"
        mt={60}
        mb={60}
        des="우건이와 아이들 과 함께 문제를 풀 제한 시간을 설정해주세요"
        highLight="우건이와 아이들"
      />
      {problemDummy.map(problem => (
        <MemoProblemContainer
          key={problem.id}
          title={problem.title}
          id={problem.id}
          recommendTime={problem.recommendTime}
          setTimes={handleTimes}
        />
      ))}
      <Center h="90px" mb="12px">
        <Text
          fontSize={
            `${totalTime}` === "문제당 최대 3시간으로 설정해주세요"
              ? "40px"
              : "60px"
          }
        >
          {totalTime}
        </Text>
      </Center>
      <NextBtn text="다음" mt={0} onBtnClick={onBtnClick} />
    </Center>
  );
}

export default TimeSetView;
