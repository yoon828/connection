import React from "react";
import { Box, Center, Text } from "@chakra-ui/react";
import ImgLoad from "./ImgLoad";

interface MainSquareProps {
  data: {
    src: string;
    title: string;
    content: string;
  };
  dir: string;
}

function MainSquare({ data, dir }: MainSquareProps) {
  return (
    <Center
      w="280px"
      h="220px"
      bg="gra"
      borderRadius="15px"
      flexDir="column"
      p="12px"
      data-aos={dir}
    >
      <Box w="80px">
        <ImgLoad name={data.src} />
      </Box>
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
