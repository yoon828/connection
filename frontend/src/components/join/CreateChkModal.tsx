import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { updateUserInfo } from "../../store/ducks/auth/authSlice";
import { useAppDispatch } from "../../store/hooks";
import { createStudy } from "../../api/studyJoin";

interface CreateChkModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyName: string;
}

function CreateChkModal({ isOpen, onClose, studyName }: CreateChkModalProps) {
  const toast = useToast();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  const handleCreateBtn = async () => {
    const res = await createStudy(studyName);
    if (axios.isAxiosError(res)) {
      if (res.response?.status === 409) {
        toast({
          title: "스터디명 중복",
          description: "이미 존재하는 스터디명입니다.",
          status: "error",
          duration: 9000,
          position: "top",
          isClosable: true
        });
        onClose();
      }
      if (res.response?.status === 400) {
        toast({
          title: "스터디 중복가입",
          description: "이미 가입하신 스터디가 존재합니다.",
          status: "error",
          duration: 9000,
          position: "top",
          isClosable: true
        });
        navigator("/study", { replace: true });
      }
    }

    if (!axios.isAxiosError(res)) {
      dispatch(updateUserInfo(res.data));
      navigator("/study", { replace: true });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent p="20px">
        <ModalHeader fontSize="32px">스터디 생성</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="24px">
          <Box>
            <Text fontWeight="700">스터디명</Text>
            <Text ml="12px">{studyName}</Text>
          </Box>
          <Text fontSize="16px" mt="24px" color="red">
            스터디는 최대 1개만 가입가능합니다.
          </Text>
          <ModalFooter p="20px 0">
            <Button
              borderRadius="12px"
              bg="gra"
              _hover={{ opacity: 0.6 }}
              onClick={handleCreateBtn}
            >
              생성하기
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default CreateChkModal;
