import {
  Box,
  Center,
  Modal,
  ModalContent,
  ModalOverlay
} from "@chakra-ui/react";
import React from "react";

import useToast from "hooks/useToast";
import JoinStep from "./JoinStep";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  status: { content: React.ReactNode; percent: number } | null;
};

function AuthModal({ isOpen, onClose, status }: AuthModalProps) {
  const toast = useToast();
  const overlayClick = () => {
    toast({
      title: "서비스를 사용하기 위한 필수 과정입니다",
      status: "error",
      position: "top"
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      onOverlayClick={overlayClick}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent bg="dep_1" maxW={650} top="30px">
        <Box position="relative" top="-50px" p="0 80px">
          {status && <JoinStep percent={status.percent} />}
        </Box>
        {status && status.content}
      </ModalContent>
    </Modal>
  );
}
export default AuthModal;
