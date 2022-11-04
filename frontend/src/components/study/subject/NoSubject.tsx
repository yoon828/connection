import React, { useEffect, useState } from "react";
import { Box, Button, Center, Flex, Link, Text } from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";

type NoSubjectProps = {
  studyRole: string;
};

function NoSubject({ studyRole }: NoSubjectProps) {
  return (
    <Center h="280px">
      {studyRole !== "LEADER" ? (
        <Center flexDir="column">
          새로운 과제를 등록해주세요😀
          <Link as={ReactLink} to="/study/assignment" _hover={{}} mt="6px">
            <Button bg="gra" width="120px" _hover={{}}>
              과제 추가
            </Button>
          </Link>
        </Center>
      ) : (
        <Box
          as="span"
          bg="sub"
          p="10px 20px"
          borderRadius="10px"
          boxShadow="md"
        >
          등록된 과제가 없어요😥
        </Box>
      )}
    </Center>
  );
}

export default NoSubject;
