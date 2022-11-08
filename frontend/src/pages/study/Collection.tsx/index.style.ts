import { Search2Icon } from "@chakra-ui/icons";
import { Flex, styled } from "@chakra-ui/react";

const SearchBox = styled(Flex, {
  baseStyle: {
    borderRadius: "20px",
    w: "200px",
    p: "3",
    bg: "dep_1",
    ml: "auto",
    mb: "6",
    cursor: "pointer",
    gap: "3",
    boxShadow: "0 4px 4px rgba(0,0,0,0.25)",
    fontSize: "lg",
    fontWeight: "normal"
  }
});

const SearchIcon = styled(Search2Icon, {
  baseStyle: {
    w: 6,
    h: 6
  }
});

export default {
  SearchBox,
  SearchIcon
};
