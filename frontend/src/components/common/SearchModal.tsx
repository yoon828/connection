import {
  Flex,
  Grid,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { AiFillFolderOpen } from "react-icons/ai";

import useToast from "hooks/useToast";
import ProblemCard from "./ProblemCard";
import useDebounce from "../../hooks/useDebounce";
import { searchProblem } from "../../api/problem";
import {
  addProblem,
  removeProblem
} from "../../store/ducks/selectedProblem/selectedProblemSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Problem } from "../../@types/Problem";

interface SearchModalTypes {
  isOpen: boolean;
  onClose: () => void;
  maxCnt: number;
}

function SearchModal({ isOpen, onClose, maxCnt = 0 }: SearchModalTypes) {
  const [problemList, setProblemList] = useState<Problem[]>([]);
  const [keyword, setKeyword] = useState("");
  const debouncedKeyword = useDebounce(keyword, 200);
  const appSelector = useAppSelector(state => state.selectedProblem);
  const dispatch = useAppDispatch();
  const toast = useToast();
  const fetch = async () => {
    const res = await searchProblem(debouncedKeyword);
    setProblemList(res.data.slice(0, 10));
  };
  useEffect(() => {
    fetch();
  }, [debouncedKeyword]);
  useEffect(() => {
    console.log(problemList);
  }, [problemList]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="5xl">
      <ModalOverlay />
      <ModalContent p={8} bg="dep_1">
        <Search2Icon
          position="absolute"
          zIndex={100}
          w={5}
          h={5}
          left="25%"
          transform="translateX(125%) translateY(50%)"
        />
        <Input
          focusBorderColor="#1581FF"
          bg="dep_2"
          fontSize="xl"
          placeholder="검색어를 입력하세요"
          paddingLeft={10}
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          w="50%"
          marginX="auto"
        />
        <ModalCloseButton />
        {problemList.length > 0 ? (
          <Grid
            templateColumns="repeat(2,1fr)"
            gridTemplateRows="auto minmax(auto,300px)"
            gap="32px"
            height="500px"
            overflowY="scroll"
            mt={8}
            p={4}
          >
            {problemList.map(problem => (
              <ProblemCard
                bg="dep_2"
                key={problem.problemInfo.problemId}
                problem={problem}
                btnType={
                  appSelector.selectedProblemList.findIndex(
                    p =>
                      p.problemInfo.problemId === problem.problemInfo.problemId
                  ) >= 0
                    ? "delete"
                    : "add"
                }
                onBtnClick={
                  appSelector.selectedProblemList.findIndex(
                    p =>
                      p.problemInfo.problemId === problem.problemInfo.problemId
                  ) >= 0
                    ? () => {
                        dispatch(removeProblem(problem));
                        toast({
                          title: `${problem.problemInfo.problemId}번 문제를 삭제했습니다.`,
                          position: "top",
                          isClosable: true,
                          status: "warning"
                        });
                      }
                    : () => {
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
                        toast({
                          title: `${problem.problemInfo.problemId}번 문제를 추가했습니다.`,
                          position: "top",
                          isClosable: true
                        });
                      }
                }
              />
            ))}
          </Grid>
        ) : (
          <Flex
            height="500px"
            direction="column"
            justifyContent="center"
            alignItems="center"
            gap={4}
            fontSize="2xl"
            fontWeight="bold"
          >
            <Icon w="50px" h="50px" as={AiFillFolderOpen} />
            <Text>검색 결과가 없어요</Text>
          </Flex>
        )}

        <ModalBody />
      </ModalContent>
    </Modal>
  );
}

export default SearchModal;
