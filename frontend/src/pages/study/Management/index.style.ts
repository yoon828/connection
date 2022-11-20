import { Box, Button, styled } from "@chakra-ui/react";

const BtnBox = styled(Box, {
  baseStyle: {
    ml: "auto",
    w: "fit-content",
    mb: 8
  }
});
const Btn = styled(Button, {
  baseStyle: {
    ml: "auto",
    bg: "dep_1",
    _hover: { bg: "dep_1", transform: "scale(1.05)" },
    _active: { bg: "dep_1", transform: "scale(1.05)" }
  }
});

export default {
  BtnBox,
  Btn
};
