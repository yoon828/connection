import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import React from "react";

interface StudyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function StudyInfoModal({ isOpen, onClose }: StudyInfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="24px">스터디 정보</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box>
            <Flex mb="12px">
              <Text fontWeight="700">스터디명</Text>
              <Text ml="12px">우건공듀와애긔들</Text>
            </Flex>
            <Flex>
              <Text fontWeight="700">스터디명</Text>
              <Text ml="12px" mr="20px">
                우건공듀
              </Text>
              <Text fontWeight="700">인원</Text>
              <Text ml="12px">4 / 6</Text>
            </Flex>
          </Box>
          <ModalFooter p="20px 0">
            <Button borderRadius="12px" bg="gra" _hover={{ opacity: 0.6 }}>
              참가하기
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default StudyInfoModal;
