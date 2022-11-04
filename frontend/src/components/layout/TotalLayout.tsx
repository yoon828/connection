import { Box, Center, Container, Flex, Heading, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface TotalLayoutProps {
  children: ReactNode;
  title: string;
  flex?: string;
  height: string;
  mr?: string;
  end?: string;
}

function TotalLayout({
  title,
  children,
  flex,
  height,
  mr,
  end
}: TotalLayoutProps) {
  return (
    <Box maxW="900px" w="100%">
      <Heading mb="14px">
        <Text
          as="span"
          bg="white"
          _dark={{ bg: "dep_2" }}
          p="6px 15px"
          borderRadius=" 10px"
          boxShadow="md"
          fontSize="18px"
          fontWeight="bold"
          color="main"
        >
          {title}
        </Text>
      </Heading>
      <Center
        h="300px"
        bg="dep_2"
        borderRadius="10px"
        boxShadow="md"
        flex={flex}
        height={height}
        mr={mr}
        mb="40px"
        alignItems={end}
      >
        {children}
      </Center>
    </Box>
  );
}
TotalLayout.defaultProps = {
  mr: "0",
  flex: 1,
  end: "center"
};

export default TotalLayout;
