import React, { ReactNode, useEffect, useState } from "react";
import { Box, Flex, Grid, useToast } from "@chakra-ui/react";
import ProblemCard from "../ProblemCard";
import SelectedProblem from "./SelectedProblem";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  addProblem,
  removeProblem,
  reset
} from "../../../store/ducks/selectedProblem/selectedProblemSlice";
import {
  getMyWorkbook,
  getRecommends
} from "../../../store/ducks/selectedProblem/selectedProblemThunk";

interface TabProps {
  selected?: boolean;
  onClick: () => void;
  children: ReactNode;
}

function Tab({ selected, onClick, children }: TabProps) {
  return (
    <Box
      p={3}
      w="full"
      borderTopRadius="20px"
      textAlign="center"
      cursor="pointer"
      bg={`${selected ? "gra" : "dep_2"}`}
      onClick={onClick}
    >
      {children}
    </Box>
  );
}
Tab.defaultProps = {
  selected: false
};

interface ProblemSelectProps {
  maxCnt: number;
}
function ProblemSelect({ maxCnt }: ProblemSelectProps) {
  const [selectedTab, setSelectedTap] = useState(0);
  const appSelector = useAppSelector(state => state.selectedProblem);
  const dispatch = useAppDispatch();
  const toast = useToast();

  useEffect(() => {
    const fetch = async () => {
      dispatch(getRecommends());
      dispatch(getMyWorkbook());
    };
    fetch();
    return () => {
      if (maxCnt === 5) dispatch(reset());
    };
  }, []);

  return (
    <Grid templateColumns="repeat(2,1fr)" gap="32px">
      <Flex direction="column" alignItems="center">
        <Box
          p={3}
          bg="gra"
          w="full"
          borderTopRadius="20px"
          textAlign="center"
          fontWeight="bold"
        >
          선택한 문제
        </Box>
        <Flex
          w="full"
          bg="dep_1"
          direction="column"
          alignItems="center"
          h="500px"
          px={8}
          py={8}
          gap={4}
          borderBottomRadius="20px"
          overflowY="scroll"
        >
          {appSelector.selectedProblemList?.map(problem => (
            <SelectedProblem
              key={problem.problemInfo.problemId}
              no={problem.problemInfo.problemId}
              title={problem.problemInfo.title}
              onDeleteHandler={() => {
                dispatch(removeProblem(problem));
              }}
            />
          ))}
        </Flex>
      </Flex>
      <Flex direction="column" alignItems="center">
        <Flex w="full" fontWeight="bold">
          <Tab selected={selectedTab === 0} onClick={() => setSelectedTap(0)}>
            추천 문제
          </Tab>
          <Tab
            selected={selectedTab === 1}
            onClick={() => {
              setSelectedTap(1);
              dispatch(getMyWorkbook());
            }}
          >
            문제집
          </Tab>
        </Flex>
        <Flex
          w="full"
          bg="dep_1"
          h="500px"
          direction="column"
          p={8}
          gap={8}
          overflowY="scroll"
          borderBottomRadius="20px"
        >
          {selectedTab === 0
            ? appSelector.showedRecommends.map(problem => (
                <ProblemCard
                  key={problem.problemInfo.problemId}
                  bg="dep_2"
                  problem={problem}
                  btnType="add"
                  onBtnClick={() => {
                    if (appSelector.cnt >= maxCnt) {
                      toast({
                        title: `선택할 수 있는 최대 갯수는 ${maxCnt}개 입니다!`,
                        position: "top",
                        isClosable: true,
                        status: "error"
                      });
                      return;
                    }
                    dispatch(addProblem(problem));
                  }}
                />
              ))
            : appSelector.showedMyWorkbook.map(problem => (
                <ProblemCard
                  key={problem.problemInfo.problemId}
                  bg="dep_2"
                  problem={problem}
                  btnType="add"
                  onBtnClick={() => {
                    if (appSelector.cnt >= maxCnt) {
                      toast({
                        title: `선택할 수 있는 최대 갯수는 ${maxCnt}개 입니다!`,
                        position: "top",
                        isClosable: true,
                        status: "error"
                      });
                      return;
                    }
                    dispatch(addProblem(problem));
                  }}
                />
              ))}
        </Flex>
      </Flex>
    </Grid>
  );
}

export default ProblemSelect;
