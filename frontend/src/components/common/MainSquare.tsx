import React, { useEffect } from "react";
import { Center, Image, Text } from "@chakra-ui/react";
import AOS from "aos";
import "aos/dist/aos.css";

interface MainSquareProps {
  data: {
    src: string;
    title: string;
    content: string;
  };
  dir: string;
}

function MainSquare({ data, dir }: MainSquareProps) {
  useEffect(() => {
    AOS.init();
  }, []);
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
