import { Box, Button, Text } from "@chakra-ui/react";
import React, { useState } from "react";

function Homework() {
  const [isBoss, setIsBoss] = useState(false);
  const [isHomwork, setIshomwork] = useState(false);

  return (
    <Box>
      {isHomwork ? (
        <Box>현재 진행중 과제 정보</Box>
      ) : isBoss ? (
        <Button bg="gra" width="120px">
          과제 추가
        </Button>
      ) : (
        <Text bg="sub" p="10px 20px" borderRadius="10px" boxShadow="md">
          등록된 과제가 없어요😥
        </Text>
      )}
    </Box>
  );
}

export default Homework;
