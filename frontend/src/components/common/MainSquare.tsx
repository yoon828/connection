import React from "react";
import { Box, Center, Flex, Image, Text } from "@chakra-ui/react";
import { v4 } from "uuid";

interface MainSquareProps {
  data: {
    src: string;
    title: string;
    content: string;
  };
}

function MainSquare({ data }: MainSquareProps) {
  return (
    <Center
      w="260px"
      h="200px"
      bg="gra"
      borderRadius="15px"
      flexDir="column"
      p="12px"
    >
      <Image src={data.src} alt="icon" w="80px" />
      <Text fontSize="20px" fontWeight="bold">
        {data.title}
      </Text>
      <Text fontSize="14px" textAlign="center">
        {data.content}
      </Text>
    </Center>
  );
}

export default MainSquare;
