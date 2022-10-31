import {
  Box,
  Flex,
  Grid,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import React, { useState } from "react";

import ProblemCard from "./ProblemCard";
import { Problem } from "../../pages/Recommend";

const dumpProblemList: Problem[] = [];

interface SearchModalTypes {
  isOpen: boolean;
  onClose: () => void;
}

function SearchModal({ isOpen, onClose }: SearchModalTypes) {
  const [problemList, setProblemList] = useState(dumpProblemList);
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent p={8} bg="dep_1">
        <Box mb={8} position="relative">
          <Search2Icon
            position="absolute"
            zIndex={100}
            w={5}
            h={5}
            transform="translateX(50%) translateY(50%)"
          />
          <Input
            focusBorderColor="#1581FF"
            bg="dep_2"
            fontSize="xl"
            placeholder="검색어를 입력하세요"
            paddingLeft={10}
          />
          <Flex
            direction="column"
            position="absolute"
            bg="dep_1"
            w="full"
            zIndex={10}
            border="1px"
            borderColor="border_gray"
            borderRadius="20px"
            borderTopRadius={0}
            py={2}
            borderTop={0}
          >
            <Box px={4} _hover={{ background: "dep_2" }}>
              <Text fontSize="xl">asd</Text>
            </Box>
            <Box px={4} _hover={{ background: "dep_2" }}>
              <Text fontSize="xl">asd</Text>
            </Box>
            <Box px={4} _hover={{ background: "dep_2" }}>
              <Text fontSize="xl">asd</Text>
            </Box>
          </Flex>
        </Box>
        <Grid templateColumns="repeat(2,1fr)" gap="32px">
          {problemList.map(problem => (
            <ProblemCard
              bg="dep_2"
              key={problem.problemInfo.problemId}
              problem={problem}
              btnType="delete"
              onBtnClick={() => {
                console.log("as");
              }}
            />
          ))}
        </Grid>
        <ModalBody />
      </ModalContent>
    </Modal>
  );
}

export default SearchModal;
