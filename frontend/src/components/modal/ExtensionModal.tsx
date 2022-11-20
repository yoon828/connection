import React from "react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Image,
  Link,
  ModalBody,
  Text
} from "@chakra-ui/react";
import useToast from "hooks/useToast";
import ExtensionImg from "../../asset/img/extensionImg.png";
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
        <Image
          src={ExtensionImg}
          alt="extenstionImg"
          w="400px"
          borderRadius="10px"
          mb="20px"
        />
        <Text fontSize={20} textAlign="center">
          “connection” 확장 프로그램이 <br />
          설치되지 않았거나 비활성화 되어있어요😢 <br />
          <Text as="span" color="main" display="inline" fontWeight="bold">
            확장 프로그램
          </Text>
          을 실행해주세요!
        </Text>
        <Flex direction="column">
          <Link
            href="https://chrome.google.com/webstore/detail/connection/opbaphhnjcekebclmnflpeppggdpenej?hl=ko&authuser=0"
            isExternal
            fontSize={14}
            fontWeight="bold"
            display="flex"
            alignItems="center"
            m="30px 0"
            textDecorationLine="underline"
          >
            Extension 설치 페이지
            <ExternalLinkIcon mx="2px" />
          </Link>
        </Flex>
        <Button bg="gra" width="100px" _hover={{}} onClick={confirmExtension}>
          확인
        </Button>
      </Center>
    </ModalBody>
  );
}

export default ExtensionModal;
