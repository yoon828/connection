import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";
import React from "react";

import useToast from "hooks/useToast";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: React.ReactNode;
};

function AuthModal({ isOpen, onClose, content }: AuthModalProps) {
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
      onOverlayClick={() => overlayClick()}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent bg="dep_1" maxW={650}>
        {content}
      </ModalContent>
    </Modal>
  );
}
export default AuthModal;
