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
  useColorMode,
  Image
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

import useToast from "hooks/useToast";
import { GetStudyInfoRes, joinStudy } from "../../api/studyJoin";
import { updateUserInfo } from "../../store/ducks/auth/authSlice";
import { useAppDispatch } from "../../store/hooks";
import GithubL from "../../asset/img/githubL.svg";
import GithubD from "../../asset/img/githubD.svg";

interface StudyInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  studyInfo: GetStudyInfoRes;
}

function StudyInfoModal({ isOpen, onClose, studyInfo }: StudyInfoModalProps) {
  const toast = useToast();
  const navigator = useNavigate();
  const dispatch = useAppDispatch();
  const { colorMode } = useColorMode();

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
      dispatch(
        updateUserInfo({
          studyCode: studyInfo.studyCode,
          studyId: studyInfo.studyId,
          studyRepository: studyInfo.studyRepository,
          studyName: studyInfo.studyName,
          studyRole: "MEMBER"
        })
      );
      navigator("/study", { replace: true });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalOverlay />
      <ModalContent p="20px">
        <ModalHeader fontSize="32px">스터디 정보</ModalHeader>
        <ModalCloseButton />
        <ModalBody fontSize="20px">
          <Box>
            <Flex mb="12px">
              <Text fontWeight="700">스터디명</Text>
              <Text ml="12px">{studyInfo.studyName}</Text>
              <Image
                ml="12px"
                src={colorMode === "light" ? GithubL : GithubD}
                w="20px"
                onClick={() => window.open(studyInfo.studyRepository)}
                _hover={{ cursor: "pointer" }}
              />
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
