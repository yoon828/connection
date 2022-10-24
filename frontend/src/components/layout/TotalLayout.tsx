import { Box, Center, Container, Flex, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface TotalLayoutProps {
  children: ReactNode;
  title: string;
  flex?: string;
  height: string;
  mr?: string;
}

function TotalLayout({ title, children, flex, height, mr }: TotalLayoutProps) {
  return (
    <Box
      maxW="900px"
      w="100%"
      h="300px"
      bg="dep_2"
      borderRadius="20px"
      boxShadow="md"
      flex={flex}
      height={height}
      position="relative"
      mr={mr}
      mb="50px"
    >
      <Text
        as="span"
        bg="white"
        p="5px 15px"
        borderRadius=" 10px"
        boxShadow="md"
        position="absolute"
        top="-15px"
        left="50%"
        transform="translate(-50%, 0%)"
        zIndex="1"
        fontSize="20px"
        fontWeight="bold"
        color="main"
      >
        {title}
      </Text>
      <Center h="100%">{children}</Center>
    </Box>
  );
}
TotalLayout.defaultProps = {
  mr: "0",
  flex: 1
};

export default TotalLayout;
