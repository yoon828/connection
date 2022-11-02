import React, { useRef, useState } from "react";

import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

import { useNavigate } from "react-router-dom";
import StudyLayout from "../../components/layout/StudyLayout";
import BackButton from "../../components/common/BackButton";
import ProblemSelect from "../../components/common/ProblemSelect/ProblemSelect";
import SearchModal from "../../components/common/SearchModal";
import getDate from "../../utils/getDate";
import { useAppSelector } from "../../store/hooks";
import { postSubject } from "../../api/subject";

function Assignment() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const startDate = getDate(new Date());
  const [endDate, setEndDate] = useState(getDate(new Date()));
  const endDateRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const appSelector = useAppSelector(state => state.selectedProblem);
  const navigate = useNavigate();
  const checkDate = (start: string, end: string) => {
    if (
      new Date(start) > new Date(end) ||
      new Date(start).getTime() / 1000 / 60 / 60 / 24 <
        Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24)
    ) {
      toast({
        title: `날짜를 똑바로 선택해주세요!`,
        position: "top",
        isClosable: true
      });
      return false;
    }
    return true;
  };
  const onEndDateChange = (date: string) => {
    if (!checkDate(startDate, date)) {
      endDateRef?.current?.focus();
      return;
    }
    setEndDate(date);
  };
  const submit = async () => {
    if (appSelector.selectedProblemList.length === 0) {
      toast({
        title: `문제를 선택해주세요!`,
        position: "top",
        isClosable: true
      });
      return;
    }

    const body = {
      deadline: endDate,
      problemList: [
        ...appSelector.selectedProblemList.map(
          problem => problem.problemInfo.problemId
        )
      ]
    };
    const res = await postSubject(body);
    if (res.data.statusCode === "ACCEPTED") {
      navigate("/study");
    } else {
      alert("에러가 발생했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <>
      <StudyLayout
        sideComponent={<BackButton />}
        title="과제 등록"
        description="스터디원들과 같이 풀 문제와 기간을 설정해주세요."
        bg="bg"
      >
        <Flex justifyContent="space-between" alignItems="center" mb={8}>
          <Flex alignItems="center" gap={4}>
            <Text fontSize="lg" fontWeight="bold" flexShrink={0}>
              과제 기간
            </Text>
            <Input
              type="date"
              bg="dep_1"
              cursor="pointer"
              value={startDate}
              readOnly
            />
            <Text fontWeight="bold">~</Text>
            <Input
              type="date"
              bg="dep_1"
              cursor="pointer"
              value={endDate}
              onChange={e => onEndDateChange(e.target.value)}
              ref={endDateRef}
            />
          </Flex>
          <Box
            bg="dep_1"
            p={2}
            borderRadius="10px"
            cursor="pointer"
            onClick={onOpen}
          >
            <Search2Icon w={6} h={6} />
          </Box>
        </Flex>
        <ProblemSelect maxCnt={5} />
        <Box mt={4} ml="auto" w="fit-content">
          <Button
            bg="gra"
            _hover={{ transform: "scale(1.05)" }}
            _active={{ transform: "scale(1.05)" }}
            onClick={submit}
          >
            등록하기
          </Button>
        </Box>
      </StudyLayout>
      <SearchModal isOpen={isOpen} onClose={onClose} maxCnt={5} />
    </>
  );
}

export default Assignment;
