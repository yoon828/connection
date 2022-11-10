import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Link, Text, Tooltip } from "@chakra-ui/react";
import { v4 } from "uuid";
import { getRank } from "../../api/study";
import { useAppSelector } from "../../store/hooks";

type RankingProps = {
  homeworkScore: number;
  ranking: number;
  studyId: number;
  studyName: string;
  studyScore: number;
  totalScore: number;
  studyRepository: string;
};

function Ranking() {
  const id = useAppSelector(state => state.auth.information?.studyId);
  const [ranks, setRanks] = useState<RankingProps[]>([]);
  const [loading, setLoading] = useState(false);
  const myStudyRef = useRef<null | HTMLDivElement>(null);
  const parentRef = useRef<null | HTMLDivElement>(null);

  const getRanking = async () => {
    const {
      data: { data }
    } = await getRank();
    setRanks(data);
    setLoading(true);
  };
  useEffect(() => {
    getRanking();
  }, []);

  useEffect(() => {
    if (myStudyRef.current && parentRef.current) {
      const { scrollHeight } = myStudyRef.current;
      const test = myStudyRef.current.offsetTop;
      // 가운데로 포커싱하기 위해 빼주는 값
      const centerHeight =
        parentRef.current.clientHeight / 2 -
        myStudyRef.current.clientHeight / 2;
      console.log(scrollHeight);
      console.log(test);
      console.log(centerHeight);
      console.log(test - centerHeight);
      parentRef.current.scrollTo({
        top: scrollHeight,
        behavior: "smooth"
      });
    }
  }, [loading]);

  return (
    <Box
      h="100%"
      w="100%"
      overflowY="auto"
      display="flex"
      flexDir="column"
      alignItems="center"
      p="26px 0 10px"
      ref={parentRef}
    >
      {ranks.map(study => {
        return (
          <Link href={study.studyRepository} key={v4()} _hover={{}}>
            <Tooltip
              label={
                <div>
                  {study.studyName}
                  <br />
                  과제 점수 : {study.homeworkScore} <br />
                  문제 풀이 점수 : {study.studyScore} <br /> 총 점수 :
                  {study.totalScore}
                </div>
              }
            >
              <Flex
                bg={id === study.studyId ? "gra" : "white"}
                borderRadius="15px"
                boxShadow="md"
                p="8px 16px"
                m="3px 0"
                w="200px"
                _dark={id === study.studyId ? {} : { bg: "dep_3" }}
                ref={id === study.studyId ? myStudyRef : null}
              >
                <Text w="40px">{study.ranking}</Text>
                <Text
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {study.studyName}
                </Text>
              </Flex>
            </Tooltip>
          </Link>
        );
      })}
      {ranks.map(study => {
        return (
          <Link href={study.studyRepository} key={v4()} _hover={{}}>
            <Tooltip
              label={
                <div>
                  {study.studyName}
                  <br />
                  과제 점수 : {study.homeworkScore} <br />
                  문제 풀이 점수 : {study.studyScore} <br /> 총 점수 :
                  {study.totalScore}
                </div>
              }
            >
              <Flex
                bg={id === study.studyId ? "gra" : "white"}
                borderRadius="15px"
                boxShadow="md"
                p="8px 16px"
                m="3px 0"
                w="200px"
                _dark={id === study.studyId ? {} : { bg: "dep_3" }}
              >
                <Text w="40px">{study.ranking}</Text>
                <Text
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                >
                  {study.studyName}
                </Text>
              </Flex>
            </Tooltip>
          </Link>
        );
      })}
    </Box>
  );
}

export default Ranking;
