import { Accordion, Center, useDisclosure } from "@chakra-ui/react";
import React from "react";
import StudyInfoModal from "../components/join/StudyInfoModal";
import JoinAccordionItem from "../components/study/JoinAccordionItem";

function StudyJoin() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Center w="1200px" m="auto">
      <Accordion w="640px" mt="160px" allowToggle>
        <JoinAccordionItem
          title="스터디 생성하기"
          panelTitle="스터디명"
          btnTitle="생성"
          errMsg=""
          onInputChange={undefined}
          onBtnClick={undefined}
        />
        <JoinAccordionItem
          title="스터디 참가하기"
          panelTitle="스터디 코드"
          btnTitle="참가"
          errMsg="유효하지 않은 스터디 코드입니다."
          onInputChange={undefined}
          onBtnClick={onOpen}
        />
      </Accordion>
      <StudyInfoModal isOpen={isOpen} onClose={onClose} />
    </Center>
  );
}

export default StudyJoin;
