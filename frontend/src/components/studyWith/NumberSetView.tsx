import { Button, ButtonGroup, Center, Highlight, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import NextBtn from "./NextBtn";
import ViewTitle from "./ViewTitle";

type NumberSetViewProps = {
  onBtnClick: () => void;
};

function NumberSetView({ onBtnClick }: NumberSetViewProps) {
  const [selectedNum, setSelectedNum] = useState(0);
  return (
    <Center w="1200px" m="auto" flexDir="column">
      <ViewTitle
        mt={60}
        main="문제 개수 선택"
        mb={80}
        des="우건이와 아이들 과 함께 풀 문제 개수를 선택해주세요"
        highLight="우건이와 아이들"
      />
      <ButtonGroup spacing="32px" mb="120px">
        {[1, 2, 3].map(num => {
          return (
            <Button
              w="120px"
              h="52px"
              borderRadius="16px"
              fontSize="24px"
              key={num}
              bg={selectedNum === num ? "gra" : "dep_1"}
              shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
              onClick={() => setSelectedNum(num)}
              _hover={{ opacity: 0.6 }}
              _active={{ opacity: 1 }}
            >
              {num} 문제
            </Button>
          );
        })}
      </ButtonGroup>
      <NextBtn
        text="다음"
        onBtnClick={onBtnClick}
        disabled={selectedNum === 0}
      />
    </Center>
  );
}

export default NumberSetView;
