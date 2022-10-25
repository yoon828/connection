import { Box, Button, Center, Flex, Select, Text } from "@chakra-ui/react";

import React, { useState } from "react";

type ReviewBarProps = {
  name: string;
  id: number;
  setTiers: (id: number, tier: string) => void;
};

type ReviewViewProps = {
  onBtnClick: () => void;
};

function ReviewBar({ id, name, setTiers }: ReviewBarProps) {
  return (
    <Flex
      w="640px"
      h="64px"
      bg="dep_1"
      p="0 24px"
      borderRadius="20px"
      shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
      fontSize="20px"
      mb="20px"
      justifyContent="space-between"
    >
      <Center>
        <Text w="60px" mr="12px" borderRight="1px solid #b8b8b8">
          {id}
        </Text>
        <Text>{name}</Text>
      </Center>
      <Center>
        <Select w="120px" bg="dep_2" borderRadius="12px">
          <option value="브">브</option>
          <option value="실">실</option>
          <option value="골">골</option>
        </Select>
      </Center>
    </Flex>
  );
}

function ReviewView({ onBtnClick }: ReviewViewProps) {
  const dummy = [
    { name: "지뢰를 찾아서", id: 212 },
    { name: "미로탈출", id: 2321 },
    { name: "무슨 열차 999", id: 726 }
  ];
  const [tiers, setTiers] = useState<Map<number, string>>(new Map());

  return (
    <Center w="1200px" m="auto" flexDir="column">
      <Text fontSize="40px" fontWeight="700" mt="40px" mb="32px">
        문제 리뷰
      </Text>
      <Text mb="60px" fontSize="20px">
        문제에 대한 리뷰 및 평가를 입력해주세요
      </Text>
      {dummy &&
        dummy.map((d, ind) => (
          <ReviewBar
            key={d.name}
            name={d.name}
            id={d.id}
            setTiers={(id: number, tier: string) =>
              setTiers(prev => new Map(prev).set(id, tier))
            }
          />
        ))}

      <Button
        w="160px"
        h="48px"
        borderRadius="16px"
        fontSize="24px"
        bg="gra"
        mt="40px"
        _hover={{ opacity: 0.6 }}
        onClick={onBtnClick}
      >
        다음
      </Button>
    </Center>
  );
}

export default ReviewView;
