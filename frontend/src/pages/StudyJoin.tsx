import { Accordion, Center, useDisclosure, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dupliChkStudy, getStudyInfo, GetStudyInfoRes } from "../api/studyJoin";
import CreateChkModal from "../components/modal/CreateChkModal";
import StudyInfoModal from "../components/modal/StudyInfoModal";
import JoinAccordionItem from "../components/study/JoinAccordionItem";
import { updateUserInfo } from "../store/ducks/auth/authSlice";
import { useAppDispatch } from "../store/hooks";

type ErrorMsgType =
  | ""
  | "유효하지 않은 스터디 코드입니다."
  | "이미 존재하는 스터디명입니다."
  | "스터디코드를 입력해주세요."
  | "스터디명을 입력해주세요.";

function StudyJoin() {
  const {
    isOpen: studyInfoModalIsOpen,
    onOpen: studyInfoModalOnOpen,
    onClose: studyInfoModalOnClose
  } = useDisclosure();

  const {
    isOpen: createChkModalIsOpen,
    onOpen: createChkModalOnOpen,
    onClose: createChkModalOnClose
  } = useDisclosure();

  const [studyName, setStudyName] = useState("");
  const [studyCode, setStudyCode] = useState("");
  const [studyInfo, setStudyInfo] = useState<GetStudyInfoRes>(
    {} as GetStudyInfoRes
  );
  const [createErr, setCreateErr] = useState<ErrorMsgType>("");
  const [joinErr, setJoinErr] = useState<ErrorMsgType>("");

  const navigator = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();

  const handleCreateBtn = async () => {
    if (!studyName) {
      setCreateErr("스터디명을 입력해주세요.");
      return;
    }
    const res = await dupliChkStudy(studyName);
    if (axios.isAxiosError(res)) {
      if (res.response?.status === 409) {
        setCreateErr("이미 존재하는 스터디명입니다.");
      }
      if (res.response?.status === 418) {
        dispatch(updateUserInfo({ ismember: false }));
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
    } else {
      createChkModalOnOpen();
    }
  };

  const handleJoinBtn = async () => {
    if (!studyCode) {
      setJoinErr("스터디코드를 입력해주세요.");
      return;
    }

    const res = await getStudyInfo(studyCode);
    if (axios.isAxiosError(res)) {
      setJoinErr("유효하지 않은 스터디 코드입니다.");
    } else {
      setJoinErr("");
      setStudyInfo(res.data);
      studyInfoModalOnOpen();
    }
  };
  return (
    <Center w="1200px" m="auto">
      <Accordion w="640px" mt="160px" allowToggle defaultIndex={[0]}>
        <JoinAccordionItem
          title="스터디 참가하기"
          panelTitle="스터디 코드"
          btnTitle="참가"
          errMsg={joinErr}
          onInputChange={(code: string) => setStudyCode(code)}
          onBtnClick={handleJoinBtn}
        />
        <JoinAccordionItem
          title="스터디 생성하기"
          panelTitle="스터디명"
          btnTitle="생성"
          errMsg={createErr}
          onInputChange={(name: string) => setStudyName(name)}
          onBtnClick={handleCreateBtn}
        />
      </Accordion>
      <StudyInfoModal
        studyInfo={studyInfo}
        isOpen={studyInfoModalIsOpen}
        onClose={studyInfoModalOnClose}
      />
      <CreateChkModal
        studyName={studyName}
        isOpen={createChkModalIsOpen}
        onClose={createChkModalOnClose}
      />
    </Center>
  );
}

export default StudyJoin;
