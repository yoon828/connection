import { Button, ButtonGroup, Center, Highlight, Text } from "@chakra-ui/react";
import React, { useState } from "react";

type NumberSetViewProps = {
  onBtnClick: () => void;
};

function NumberSetView({ onBtnClick }: NumberSetViewProps) {
  const [selectedNum, setSelectedNum] = useState(0);
  return (
    <Center w="1200px" m="auto" flexDir="column">
      <Text fontSize="48px" fontWeight="700" mt="60px" mb="32px">
        문제 개수 선택
      </Text>
      <Text mb="80px" fontSize="16px">
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
          우건이와 아이들 과 함께 풀 문제 개수를 선택해주세요
        </Highlight>
      </Text>

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
      <Button
        w="160px"
        h="48px"
        borderRadius="16px"
        fontSize="24px"
        bg="gra"
        _hover={{ opacity: 0.6 }}
        _active={{ opacity: 1 }}
        onClick={onBtnClick}
        disabled={selectedNum === 0}
      >
        다음
      </Button>
    </Center>
  );
}

export default NumberSetView;
