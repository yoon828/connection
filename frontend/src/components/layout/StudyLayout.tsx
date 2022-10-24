import { Box, Container, Flex, Text } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { v4 as uuid } from "uuid";

interface StudyLayoutProps {
  sideComponent: ReactNode;
  children: ReactNode;
  title: string;
  description: string;
  bg?: string;
}

function StudyLayout({
  sideComponent,
  title,
  description,
  bg,
  children
}: StudyLayoutProps) {
  return (
    <Container maxW="1200px" mt="80px">
      <Flex>
        <Flex
          width="200px"
          top="40px"
          position="relative"
          direction="column"
          gap="5px"
        >
          {sideComponent}
        </Flex>
        <Box borderRadius="20px" bg={bg} w="100%" p="20px" zIndex={1}>
          <Box mb="40px">
            <Text fontSize="3xl" fontWeight="bold" mt="20px" mb="20px">
              {title}
            </Text>
            {description.split("/").map(text => (
              <Text key={uuid()} mt="10px" mb="10px">
                {text}
              </Text>
            ))}
          </Box>
          {children}
        </Box>
      </Flex>
    </Container>
  );
}

StudyLayout.defaultProps = {
  bg: "white_lin"
};

export default StudyLayout;
