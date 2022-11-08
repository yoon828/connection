import { Search2Icon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, styled, Text } from "@chakra-ui/react";

const Container = styled(Flex, {
  baseStyle: {
    justifyContent: "space-between",
    alignItems: "center",
    mb: 8
  }
});

const Top = styled(Flex, {
  baseStyle: {
    alignItems: "center",
    gap: 4
  }
});

const TopText = styled(Text, {
  baseStyle: {
    fontSize: "lg",
    fontWeight: "bold",
    flexShrink: 0
  }
});

const SearchIcon = styled(Search2Icon, {
  baseStyle: {
    w: 6,
    h: 6
  }
});

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

const SubmitBtnBox = styled(Box, {
  baseStyle: {
    mt: 4,
    ml: "auto",
    w: "fit-content"
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
  Container,
  Top,
  TopText,
  SearchIcon,
  DurationInput,
  SearchIconBox,
  SubmitBtnBox,
  SubmitBtn
};
