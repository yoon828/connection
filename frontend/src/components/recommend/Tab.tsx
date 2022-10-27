import { Flex } from "@chakra-ui/react";
import React from "react";

interface TapProps {
  label: string;
  id: number;
  isSelected?: boolean;
  onTabClick: React.MouseEventHandler<HTMLDivElement>;
}

function Tap({ id, label, isSelected, onTabClick }: TapProps) {
  return (
    <Flex
      bg={isSelected ? "sub" : "dep_1"}
      height="48px"
      borderRadius="15px 0 0 15px"
      fontWeight="bold"
      boxShadow="0 4px 4px rgba(0,0,0,0.25)"
      onClick={onTabClick}
      data-id={id}
      cursor="pointer"
      alignItems="center"
      pl={4}
    >
      {label}
    </Flex>
  );
}

Tap.defaultProps = {
  isSelected: false
};

export default Tap;
