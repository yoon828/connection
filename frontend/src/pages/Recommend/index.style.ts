import { RepeatIcon } from "@chakra-ui/icons";
import { styled } from "@chakra-ui/react";

const StyledIcon = styled(RepeatIcon, {
  baseStyle: {
    w: 10,
    h: 10,
    position: "absolute",
    top: 120,
    right: 12,
    cursor: "pointer",
    transition: "transform .6s"
  }
});

export default {
  StyledIcon
};
