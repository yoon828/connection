import { Box, Container, Flex } from "@chakra-ui/react";
import React, { ReactNode } from "react";

interface StudyLayoutProps {
  sideComponent: ReactNode;
  children: ReactNode;
}

function StudyLayout({ sideComponent, children }: StudyLayoutProps) {
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
        <Box borderRadius="20px" bg="white_lin" w="100%" p="20px" zIndex={1}>
          {children}
        </Box>
      </Flex>
    </Container>
  );
}

export default StudyLayout;
