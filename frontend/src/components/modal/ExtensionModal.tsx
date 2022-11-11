import React from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { Button, Center, Flex, Link, ModalBody, Text } from "@chakra-ui/react";

import useToast from "hooks/useToast";
import checkExtension from "../../utils/checkExtension";

type ExtensionModalProps = {
  onClose: () => void;
};

function ExtensionModal({ onClose }: ExtensionModalProps) {
  const toast = useToast();
  const confirmExtension = async () => {
    checkExtension(
      () => {
        toast({
          title: "확인되었습니다😊",
          position: "top",
          status: "success",
          duration: 1000
        });
        onClose();
      },
      () => {
        toast({
          title: "확장프로그램을 설치해주세요😥",
          description: "확장프로그램 설치하거나 실행해주세요",
          status: "error",
          position: "top",
          duration: 1000
        });
      }
    );
  };

  return (
    <ModalBody p="50px">
      <Text fontSize="30px" fontWeight="bold">
        Extension
      </Text>
      <Center p="50px 0 30px" flexDir="column">
        <Text fontSize={20} textAlign="center">
          “connection” 확장 프로그램이 <br />
          설치되지 않았거나 꺼져있어요😢 <br />
          확장 프로그램을 실행해주세요!
        </Text>
        <Flex direction="column">
          <Link
            href="https://chrome.google.com/webstore/detail/connection/opbaphhnjcekebclmnflpeppggdpenej?hl=ko&authuser=0"
            isExternal
            fontSize={12}
            display="flex"
            alignItems="center"
            m="30px 0"
            textDecorationLine="underline"
          >
            Extension 설치 페이지
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Flex>
        <Button
          bg="gra"
          width="100px"
          _hover={{}}
          onClick={() => confirmExtension()}
        >
          확인
        </Button>
      </Center>
    </ModalBody>
  );
}

export default ExtensionModal;
