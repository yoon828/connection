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
  Text,
  useToast
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GetStudyInfoRes, joinStudy } from "../../api/studyJoin";
import { updateUserInfo } from "../../store/ducks/auth/authSlice";
import { useAppDispatch } from "../../store/hooks";

interface StudyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyInfo: GetStudyInfoRes;
}

function StudyInfoModal({ isOpen, onClose, studyInfo }: StudyInfoModalProps) {
  const toast = useToast();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();

  const handleJoinBtn = async () => {
    const res = await joinStudy(studyInfo.studyCode);
    if (axios.isAxiosError(res)) {
      if (res.response?.status === 404) {
        toast({
          title: "스터디 코드확인",
          description: "스터디가 존재하지 않습니다.",
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
      dispatch(updateUserInfo({ studyCode: studyInfo.studyCode }));
      navigator("/study", { replace: true });
    }
  };

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
              <Text ml="12px">{studyInfo.studyName}</Text>
            </Flex>
            <Flex>
              <Text fontWeight="700">스터디장</Text>
              <Text ml="12px" mr="20px">
                {studyInfo.studyLeaderName}
              </Text>
              <Text fontWeight="700">인원</Text>
              <Text ml="12px">{studyInfo.studyPersonnel} / 6</Text>
            </Flex>
          </Box>
          <ModalFooter p="20px 0">
            <Button
              borderRadius="12px"
              bg="gra"
              _hover={{ opacity: 0.6 }}
              onClick={handleJoinBtn}
            >
              참가하기
            </Button>
          </ModalFooter>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default StudyInfoModal;
