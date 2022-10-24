import { Box, Button, Flex, Grid, Text } from "@chakra-ui/react";
import React from "react";
import BackButton from "../../components/common/BackButton";
import StudyLayout from "../../components/layout/StudyLayout";

function Management() {
  return (
    <StudyLayout
      title="스터디 관리"
      description="스터디원들의 활동 내역을 확인할 수 있어요"
      sideComponent={<BackButton />}
    >
      <Box ml="auto" w="fit-content" mb="8">
        <Button
          ml="auto"
          bg="dep_1"
          _hover={{ bg: "dep_1", transform: "scale(1.05)" }}
          _active={{ bg: "dep_1", transform: "scale(1.05)" }}
        >
          스터디 탈퇴
        </Button>
      </Box>
      <Grid templateColumns="repeat(2,1fr)" gap="32px">
        <Box bg="dep_1">
          <Flex bg="dep_2" p={2} textAlign="center">
            <Text flexGrow={1} borderRight="1px" borderColor="border_gray">
              No 1
            </Text>
            <Text flexGrow={3} borderRight="1px" borderColor="border_gray">
              진호
            </Text>
            <Text flexGrow={1} color="red" cursor="pointer">
              추방
            </Text>
          </Flex>
          <Box h="200px" />
        </Box>
      </Grid>
    </StudyLayout>
  );
}

export default Management;
