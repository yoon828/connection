import React from "react";
import { Box, Button, ComponentWithAs, IconProps } from "@chakra-ui/react";

type SlideArrowProps = {
  type: string;
  onClick: () => void;
  isDisabled: boolean;
  Icon: ComponentWithAs<"svg", IconProps>;
};

export default function SlideArrow({
  type,
  onClick,
  isDisabled,
  Icon
}: SlideArrowProps) {
  return !isDisabled ? (
    <Button
      onClick={onClick}
      w="30px"
      style={{ background: "none" }}
      disabled={isDisabled}
      position="absolute"
      top="50%"
      transform="translateY(-50%)"
      right={type === "right" ? "0px" : ""}
    >
      <Icon
        boxSize={8}
        color={isDisabled ? "gray.300" : "black"}
        _dark={{ color: `${isDisabled ? "gray.900" : "gray.100"} ` }}
      />
    </Button>
  ) : (
    <Box w="30px" />
  );
}
