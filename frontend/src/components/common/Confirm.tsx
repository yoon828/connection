import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import React from "react";

interface ConfirmPropType {
  isOpen: boolean;
  onClose: () => void;
  msg: string;
  onConfirmHandler: () => void;
}

function Confirm({ isOpen, onClose, msg, onConfirmHandler }: ConfirmPropType) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <Text fontSize="2xl" fontWeight="bold" align="center">
            {msg}
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            mr={3}
            onClick={() => {
              onConfirmHandler();
              onClose();
            }}
          >
            네
          </Button>
          <Button variant="ghost" onClick={onClose}>
            아니요
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default Confirm;
