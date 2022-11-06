import React from "react";
import { Button, ComponentWithAs, IconProps } from "@chakra-ui/react";

type SlideArrowProps = {
  onClick: () => void;
  isDisabled: boolean;
  Icon: ComponentWithAs<"svg", IconProps>;
};

export default function SlideArrow({
  onClick,
  isDisabled,
  Icon
}: SlideArrowProps) {
  return (
    <Button
      onClick={onClick}
      style={{ all: "unset" }}
      cursor={isDisabled ? "default" : "pointer"}
      disabled={isDisabled}
    >
      <Icon
        boxSize={8}
        color={isDisabled ? "gray.300" : "black"}
        _dark={{ color: `${isDisabled ? "gray.900" : "gray.100"} ` }}
      />
    </Button>
  );
}
