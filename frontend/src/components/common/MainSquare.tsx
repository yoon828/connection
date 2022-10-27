import React from "react";
import { Center, Image, Text } from "@chakra-ui/react";

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
      w="280px"
      h="220px"
      bg="gra"
      borderRadius="15px"
      flexDir="column"
      p="12px"
    >
      <Image src={data.src} alt="icon" w="80px" />
      <Text fontSize="20px" fontWeight="bold">
        {data.title}
      </Text>
      <Text fontSize="14px" textAlign="center" p="14px">
        {data.content}
      </Text>
    </Center>
  );
}

export default MainSquare;
