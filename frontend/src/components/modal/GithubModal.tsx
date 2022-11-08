import React from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Link,
  ModalBody,
  Text,
  useToast
} from "@chakra-ui/react";
import { postGithubConfirm } from "../../api/auth";
import { useAppDispatch } from "../../store/hooks";
import { updateUserInfo } from "../../store/ducks/auth/authSlice";

function GithubModal() {
  const toast = useToast();
  const dispatch = useAppDispatch();
  const confirmGithub = async () => {
    try {
      const { data } = await postGithubConfirm();
      toast({
        title: "connection의 멤버가 된 걸 환영합니다😊",
        position: "top",
        status: "success"
      });
      dispatch(updateUserInfo({ ismember: true }));
    } catch (error) {
      console.log(error);
      toast({
        title: "가입이 확인되지 않았습니다😥",
        position: "top",
        status: "error"
      });
    }
  };

  return (
    <ModalBody p="50px">
      <Text fontSize="30px" fontWeight="bold">
        Github
      </Text>
      <Center p="50px 0 30px" flexDir="column">
        <Text fontSize={20} mt="5px" textAlign="center">
          Github에서 “co-nnectnion”
          <br /> Organization 초대 수락 후,
          <br />
          <Text as="span" color="main" display="inline" fontWeight="bold">
            확인
          </Text>{" "}
          버튼을 눌러주세요
        </Text>
        <Flex direction="column">
          <Link
            href="https://github.com/orgs/co-nnection/invitation"
            isExternal
            fontSize={12}
            display="flex"
            alignItems="center"
            m="30px 0"
            textDecorationLine="underline"
          >
            Github로 이동하기
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Flex>
        <Button
          bg="gra"
          width="100px"
          _hover={{}}
          onClick={() => confirmGithub()}
        >
          확인
        </Button>
      </Center>
    </ModalBody>
  );
}

export default GithubModal;
