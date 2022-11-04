import { Box, Button, Input, styled } from "@chakra-ui/react";

const DurationInput = styled(Input, {
  baseStyle: {
    bg: "dep_1",
    cursor: "pointer"
  }
});

const SearchIconBox = styled(Box, {
  baseStyle: {
    bg: "dep_1",
    p: 2,
    borderRadius: "10px",
    cursor: "pointer"
  }
});

const SubmitBtn = styled(Button, {
  baseStyle: {
    bg: "gra",
    _hover: { transform: "scale(1.05)" },
    _active: { transform: "scale(1.05)" }
  }
});

export default {
  DurationInput,
  SearchIconBox,
  SubmitBtn
};
