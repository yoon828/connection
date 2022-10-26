import { Box, Button, Link, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as ReactLink } from "react-router-dom";

function Homework() {
  const [isBoss, setIsBoss] = useState(true);
  const [isHomwork, setIshomwork] = useState(false);

  return (
    <Box>
      {isHomwork ? (
        <Box>현재 진행중 과제 정보</Box>
      ) : isBoss ? (
        <Link as={ReactLink} to="/study/assignment" mb="60px" _hover={{}}>
          <Button bg="gra" width="120px" _hover={{}}>
            과제 추가
          </Button>
        </Link>
      ) : (
        <Text bg="sub" p="10px 20px" borderRadius="10px" boxShadow="md">
          등록된 과제가 없어요😥
        </Text>
      )}
    </Box>
  );
}

export default Homework;
