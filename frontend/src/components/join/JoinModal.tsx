import React, { useRef, useState } from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Link,
  ModalBody,
  ModalContent,
  Text
} from "@chakra-ui/react";
import { getUserProblems } from "../../api/auth";

type JoinModalProps = {
  onClose: () => void;
};

function JoinModal({ onClose }: JoinModalProps) {
  const [id, setId] = useState("yoon828990");

  // 백준에서 푼 문제 가져오기
  const confirmBJ = async () => {
    onClose();
    const data = await getUserProblems("yoon828990", 1);
  };

  return (
    <ModalContent bg="dep_1" maxW={650}>
      <ModalBody p="50px">
        <Text fontSize="30px" fontStyle="bold">
          백준 연동
        </Text>
        <Center p="50px 0 30px" flexDir="column">
          <Flex w="350px" mb="50px">
            <Flex w="70px" h={10} fontSize="18px" alignItems="center">
              백준ID
            </Flex>
            <Flex direction="column">
              <Input type="text" value={id} placeholder="백준 아이디" />
              <Text fontSize={12} mt="5px">
                인증하는데 문제가 발생했습니다
              </Text>
            </Flex>
            <Box ml="10px">
              <Button bg="gra" _hover={{}}>
                인증
              </Button>
            </Box>
          </Flex>
          <Flex w="350px">
            <Flex w="70px" h={10} fontSize="18px" alignItems="center">
              Code
            </Flex>
            <Flex direction="column">
              <Flex
                fontSize={20}
                h={10}
                fontWeight="bold"
                color="main"
                align="center"
              >
                SD2SF4
              </Flex>
              <Text fontSize={12} mt="5px">
                Solved.ac 프로필 편집 {">"} 상태메시지를
                <br /> Code로 변경한 뒤,{" "}
                <Text as="span" color="main" display="inline" fontWeight="bold">
                  인증
                </Text>{" "}
                버튼을 눌러주세요
              </Text>
              <Link
                href={`https://solved.ac/profile/${id}`}
                isExternal
                fontSize={12}
                display="flex"
                alignItems="center"
                mt="10px"
                textDecorationLine="underline"
              >
                Solved.ac로 이동하기
                <ExternalLinkIcon mx="2px" />
              </Link>
            </Flex>
          </Flex>
        </Center>
        <Center>
          <Button
            bg="gra"
            width="250px"
            _hover={{}}
            onClick={() => confirmBJ()}
          >
            연동하기
          </Button>
        </Center>
      </ModalBody>
    </ModalContent>
  );
}

export default JoinModal;
