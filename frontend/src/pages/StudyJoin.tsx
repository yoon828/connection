import { Accordion, Center, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStudy, getStudyInfo, GetStudyInfoRes } from "../api/studyJoin";
import StudyInfoModal from "../components/join/StudyInfoModal";
import JoinAccordionItem from "../components/study/JoinAccordionItem";

type ErrorMsgType =
  | ""
  | "유효하지 않은 스터디 코드입니다."
  | "이미 존재하는 스터디명입니다."
  | "스터디코드를 입력해주세요."
  | "스터디명을 입력해주세요.";

function StudyJoin() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [studyName, setStudyName] = useState("");
  const [studyCode, setStudyCode] = useState("");
  const [studyInfo, setStudyInfo] = useState<GetStudyInfoRes>(
    {} as GetStudyInfoRes
  );
  const [createErr, setCreateErr] = useState<ErrorMsgType>("");
  const [joinErr, setJoinErr] = useState<ErrorMsgType>("");

  const navigator = useNavigate();

  const handleCreateBtn = async () => {
    if (!studyName) {
      setCreateErr("스터디명을 입력해주세요.");
      return;
    }
    const res = await createStudy(studyName);
    if (axios.isAxiosError(res)) {
      setCreateErr("이미 존재하는 스터디명입니다.");
    } else {
      // 여기도 리덕스에 studyCode 추가
      navigator("/study", { replace: true });
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
      onOpen();
    }
  };
  return (
    <Center w="1200px" m="auto">
      <Accordion w="640px" mt="160px" allowToggle>
        <JoinAccordionItem
          title="스터디 생성하기"
          panelTitle="스터디명"
          btnTitle="생성"
          errMsg={createErr}
          onInputChange={(name: string) => setStudyName(name)}
          onBtnClick={handleCreateBtn}
        />
        <JoinAccordionItem
          title="스터디 참가하기"
          panelTitle="스터디 코드"
          btnTitle="참가"
          errMsg={joinErr}
          onInputChange={(code: string) => setStudyCode(code)}
          onBtnClick={handleJoinBtn}
        />
      </Accordion>
      <StudyInfoModal studyInfo={studyInfo} isOpen={isOpen} onClose={onClose} />
    </Center>
  );
}

export default StudyJoin;
