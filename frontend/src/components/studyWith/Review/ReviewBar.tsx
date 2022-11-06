import { Center, Flex, Select, Text } from "@chakra-ui/react";
import React from "react";

type ReviewBarProps = {
  name: string;
  id: number;
  setTiers: (id: number, tier: string) => void;
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
        <Select w="120px" bg="dep_2" borderRadius="12px" cursor="pointer">
          <option value="브">브</option>
          <option value="실">실</option>
          <option value="골">골</option>
        </Select>
      </Center>
    </Flex>
  );
}

export default ReviewBar;
