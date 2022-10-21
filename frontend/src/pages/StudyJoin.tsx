import { Accordion, Center } from "@chakra-ui/react";
import React from "react";
import JoinAccordionItem from "../components/study/JoinAccordionItem";

function StudyJoin() {
  return (
    <Center w="1200px" m="auto">
      <Accordion w="640px" mt="160px" allowToggle>
        <JoinAccordionItem
          title="스터디 생성하기"
          panelTitle="스터디명"
          btnTitle="생성"
          onInputChange={undefined}
          onBtnClick={undefined}
        />
        <JoinAccordionItem
          title="스터디 참가하기"
          panelTitle="스터디 코드"
          btnTitle="참가"
          onInputChange={undefined}
          onBtnClick={undefined}
        />
      </Accordion>
    </Center>
  );
}

export default StudyJoin;
