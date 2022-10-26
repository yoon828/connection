import { Button, Center, Flex, Text } from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import getTime from "../../utils/getTime";
import NextBtn from "./NextBtn";
import ViewTitle from "./ViewTitle";

function ProblemBar() {
  type problemState = "waiting" | "success" | "fail";
  const [state, setState] = useState<problemState>("fail");
  const stateBg = useMemo(() => {
    if (state === "waiting") {
      return "dep_1";
    }
    if (state === "success") {
      return "gra";
    }
    return "red_lin";
  }, [state]);
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
      <Center borderRight="1px solid #b8b8b8" h="48px" p="0 16px">
        123
      </Center>
      <Flex
        borderRight="1px solid #b8b8b8"
        w="480px"
        h="48px"
        p="0 16px"
        justify="space-between"
      >
        <Center>123</Center>
        <Center>
          <Button bg="transparent" _hover={{ background: "transparent" }}>
            문제풀기
          </Button>
        </Center>
      </Flex>
      <Center borderRight="1px solid #b8b8b8">
        <Button
          bg="transparent"
          _hover={{ background: "transparent" }}
          p="0 16px"
        >
          확인
        </Button>
      </Center>

      <Center p="0 16px">
        <Center borderRadius={50} w="20px" h="20px" bg={stateBg} />
      </Center>
    </Center>
  );
}

type TimerProps = {
  initTime: number;
};

function Timer({ initTime }: TimerProps) {
  const [time, setTime] = useState(initTime);
  const [timerId, setTimerId] = useState<ReturnType<
    typeof setTimeout
  > | null>();
  useEffect(() => {
    if (!timerId) {
      const nextTimerId = setTimeout(() => {
        setTimerId(null);
        setTime(prev => prev - 1);
      }, 1000);
      setTimerId(nextTimerId);
    }
  }, [time]);

  return (
    <Text fontSize="100px" mt="60px" textAlign="center">
      {getTime(time)}
    </Text>
  );
}

type SolvingViewProps = {
  onBtnClick: () => void;
};

function SolvingView({ onBtnClick }: SolvingViewProps) {
  return (
    <Center w="1200px" m="auto" flexDir="column">
      <Timer initTime={300} />
      <ViewTitle
        main="문제 풀이"
        des="문제를 풀었으면 확인버튼을 눌러주세요."
        highLight=""
        mt={12}
        mb={60}
        desSize={20}
      />
      <ProblemBar />
      <ProblemBar />
      <ProblemBar />
      <NextBtn text="다음" mt={20} onBtnClick={onBtnClick} />
    </Center>
  );
}

export default SolvingView;
