import React, { ChangeEvent, useRef, useState } from "react";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import StudyLayout from "../../../components/layout/StudyLayout";
import BackButton from "../../../components/common/BackButton";
import ProblemSelect from "../../../components/common/ProblemSelect/ProblemSelect";
import SearchModal from "../../../components/common/SearchModal";
import { cmpDate, getDate } from "../../../utils/getDate";
import { useAppSelector } from "../../../store/hooks";
import { postSubject } from "../../../api/subject";
import Style from "./index.style";

function Assignment() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const startDate = getDate(new Date());
  const [endDate, setEndDate] = useState(getDate(new Date()));
  const endDateRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const appSelector = useAppSelector(state => state.selectedProblem);
  const navigate = useNavigate();

  // const onEndDateChange = (date: string) => {
  const onEndDateChange = (e: ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    if (cmpDate(startDate, date)) {
      toast({
        title: `날짜를 똑바로 선택해주세요!`,
        position: "top",
        isClosable: true,
        status: "error"
      });
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
        isClosable: true,
        status: "error"
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
    if (res.data.msg === "success") {
      navigate("/study");
    } else {
      toast({
        title: `에러가 발생했습니다. 다시 시도해주세요.`,
        position: "top",
        isClosable: true,
        status: "error"
      });
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
        <Style.Container>
          <Style.Top>
            <Style.TopText>과제 기간</Style.TopText>
            <Style.DurationInput
              type="date"
              value={startDate}
              readOnly
              cursor="not-allowed"
            />
            <Style.TopText>~</Style.TopText>
            <Style.DurationInput
              type="date"
              value={endDate}
              onChange={onEndDateChange}
              ref={endDateRef}
            />
          </Style.Top>
          <Style.SearchIconBox onClick={onOpen}>
            <Style.SearchIcon />
          </Style.SearchIconBox>
        </Style.Container>
        <ProblemSelect maxCnt={5} />
        <Style.SubmitBtnBox mt={4} ml="auto" w="fit-content">
          <Style.SubmitBtn onClick={submit}>등록하기</Style.SubmitBtn>
        </Style.SubmitBtnBox>
      </StudyLayout>
      <SearchModal isOpen={isOpen} onClose={onClose} maxCnt={5} />
    </>
  );
}

export default Assignment;
