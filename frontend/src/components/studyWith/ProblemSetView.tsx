import { Button } from "@chakra-ui/react";
import React from "react";

type ProblemSetViewProps = {
  onBtnClick: () => void;
};

function ProblemSetView({ onBtnClick }: ProblemSetViewProps) {
  return (
    <div>
      문제선택뷰
      <Button
        w="160px"
        h="48px"
        borderRadius="16px"
        fontSize="24px"
        bg="gra"
        _hover={{ opacity: 0.6 }}
        _active={{ opacity: 1 }}
        onClick={onBtnClick}
      >
        다음
      </Button>
    </div>
  );
}

export default ProblemSetView;
