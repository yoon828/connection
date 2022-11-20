import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

function BackButton() {
  const navigate = useNavigate();
  return (
    <ArrowBackIcon
      w="9"
      h="9"
      onClick={() => navigate(-1)}
      cursor="pointer"
      alignSelf="center"
    />
  );
}

export default BackButton;
