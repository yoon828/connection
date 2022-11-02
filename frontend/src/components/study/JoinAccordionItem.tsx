import {
  Text,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Center,
  Flex,
  Input,
  Button
} from "@chakra-ui/react";
import React, { ChangeEvent } from "react";

type JoinAccordionItemProps = {
  title: string;
  panelTitle: string;
  btnTitle: string;
  errMsg: string;
  onInputChange: (arg: string) => void;
  onBtnClick: (() => void) | undefined;
};

function JoinAccordionItem({
  title,
  panelTitle,
  btnTitle,
  errMsg,
  onInputChange,
  onBtnClick
}: JoinAccordionItemProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange(e.target.value);
  };
  return (
    <AccordionItem
      bg="dep_1"
      border="none"
      borderRadius="10px"
      shadow="5px 4px 10px rgba(0, 0, 0, 0.25)"
      mb="32px"
    >
      <AccordionButton
        h="48px"
        borderRadius="10px"
        _hover={{ background: "gra" }}
        _expanded={{ borderRadius: "10px 10px 0 0", background: "gra" }}
      >
        <Center flex="1" textAlign="center">
          <Text fontSize="24px" fontWeight="700">
            {title}
          </Text>
        </Center>
      </AccordionButton>
      <AccordionPanel
        bg="dep_1"
        borderRadius="0 0 10px 10px"
        border="none"
        p="40px 60px 30px 60px"
      >
        <Flex>
          <Center textAlign="center" flex={3} fontSize="20px" fontWeight="700">
            {panelTitle}
          </Center>
          <Input
            onChange={handleInputChange}
            flex={6}
            m="0 20px"
            bg="dep_2"
            fontSize="20px"
            borderRadius="12px"
          />
          <Button
            flex={1}
            borderRadius="12px"
            bg="gra"
            _hover={{ opacity: 0.6 }}
            onClick={onBtnClick}
          >
            {btnTitle}
          </Button>
        </Flex>
        <Center h="12px" pt="24px" color="red" fontWeight="500">
          {errMsg}
        </Center>
      </AccordionPanel>
    </AccordionItem>
  );
}

export default JoinAccordionItem;
