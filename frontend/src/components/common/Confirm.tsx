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
import React, { useRef, useState } from "react";

interface ConfirmPropType {
  isOpen: boolean;
  onClose: () => void;
  msg: string;
  onConfirmHandler: () => Promise<void> | null;
}

function Confirm({ isOpen, onClose, msg, onConfirmHandler }: ConfirmPropType) {
  const [pending, setPending] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval>>();
  const [dot, setDot] = useState(0);

  const onBtnClick = async () => {
    setPending(true);
    timer.current = setInterval(() => {
      setDot(prev => (prev % 3) + 1);
    }, 500);
    await onConfirmHandler();
    clearInterval(timer.current);
    setPending(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={!pending}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader />
        <ModalBody>
          <Text fontSize="2xl" fontWeight="bold" align="center">
            {pending ? `요청중입니다${".".repeat(dot)}` : msg}
          </Text>
        </ModalBody>
        <ModalFooter>
          {!pending && (
            <>
              <Button colorScheme="red" mr={3} onClick={onBtnClick}>
                네
              </Button>
              <Button variant="ghost" onClick={onClose}>
                아니요
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default Confirm;
