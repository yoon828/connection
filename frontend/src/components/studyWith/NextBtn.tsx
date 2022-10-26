import { Button } from "@chakra-ui/react";
import React from "react";

interface NextBtnProps {
  mt?: number;
  text: string;
  disabled?: boolean;
  onBtnClick: () => void;
}

function NextBtn({ mt, text, disabled, onBtnClick }: NextBtnProps) {
  return (
    <Button
      w="160px"
      h="48px"
      borderRadius="16px"
      fontSize="24px"
      bg="gra"
      mt={`${mt}px`}
      mb="32px"
      _hover={{ opacity: 0.6 }}
      _active={{ opacity: 1 }}
      onClick={onBtnClick}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}

NextBtn.defaultProps = {
  mt: 0,
  disabled: false
};

export default NextBtn;
