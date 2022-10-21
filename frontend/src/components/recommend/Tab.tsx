import { Center } from "@chakra-ui/react";
import React from "react";

interface TapProps {
  label: string;
  id: number;
  isSelected?: boolean;
  onTabClick: React.MouseEventHandler<HTMLDivElement>;
}

function Tap({ id, label, isSelected, onTabClick }: TapProps) {
  return (
    <Center
      bg={isSelected ? "sub" : "dep_1"}
      height="40px"
      borderRadius="15px 0 0 15px"
      boxShadow="0 4px 4px rgba(0,0,0,0.25)"
      onClick={onTabClick}
      data-id={id}
      cursor="pointer"
    >
      {label}
    </Center>
  );
}

Tap.defaultProps = {
  isSelected: false
};

export default Tap;
