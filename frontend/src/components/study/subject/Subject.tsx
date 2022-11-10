import React from "react";
import { Flex, Text } from "@chakra-ui/react";
import SubjectChart from "./SubjectChart";
import SubjectTable from "./SubjectTable";
import { SubjectProps } from "./SubjectView";

function Subject({ problems, users, deadline }: SubjectProps) {
  return (
    <Flex w="100%" flexDir="column" flex="none" p="6px 30px">
      <Flex m="12px" fontSize="14px" flexDir="column" mb="20px">
        <Text fontWeight="bold" mb="5px">
          총 문제수 : {problems.length}문제
        </Text>
        <Text>
          과제 기간 :{deadline[0]} ~ {deadline[1]}
        </Text>
      </Flex>
      <Flex>
        <SubjectTable problems={problems} users={users} flex={3} />
        <SubjectChart users={users} flex={1} />
      </Flex>
    </Flex>
  );
}

export default Subject;
