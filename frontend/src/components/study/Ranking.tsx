import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Link, Text, Tooltip, Image } from "@chakra-ui/react";
import { v4 } from "uuid";
import { getRank } from "../../api/study";
import { useAppSelector } from "../../store/hooks";
import getMedalColor from "../../utils/getMedalColor";

type RankingProps = {
  bonusScore: number;
  ranking: number;
  studyId: number;
  studyName: string;
  studyRepository: string;
  studyScore: number;
  subjectScore: number;
  totalScore: number;
};

function Ranking() {
  const id = useAppSelector(state => state.auth.information?.studyId);
  const [ranks, setRanks] = useState<RankingProps[]>([]);
  const myStudyRef = useRef<null | HTMLAnchorElement>(null);
  const parentRef = useRef<null | HTMLDivElement>(null);

  const getRanking = async () => {
    const {
      data: { data }
    } = await getRank();
    console.log(data);
    setRanks(data);
  };

  useEffect(() => {
    getRanking();
  }, []);

  useEffect(() => {
    ranks.forEach((study, idx) => {
      if (study.studyId === id && parentRef.current && myStudyRef.current) {
        const myHeight = myStudyRef.current.clientHeight;
        const parentHeight = parentRef.current.clientHeight;
        parentRef.current.scrollTo({
          top: 10 + idx * myHeight - parentHeight / 2 + myHeight / 2,
          behavior: "smooth"
        });
      }
    });
  }, [ranks]);

  return (
    <Box
      h="100%"
      w="100%"
      overflowY="auto"
      display="flex"
      flexDir="column"
      alignItems="center"
      p="10px 0 10px"
      ref={parentRef}
      // onScroll={get}
    >
      {ranks.map(study => {
        return (
          <Link
            href={study.studyRepository}
            key={v4()}
            _hover={{}}
            ref={id === study.studyId ? myStudyRef : null}
          >
            <Tooltip
              label={
                <div>
                  {study.studyName}
                  <br />
                  과제 점수 : {study.subjectScore} <br />
                  문제 풀이 점수 : {study.studyScore} <br />
                  보너스 점수 : {study.bonusScore} <br />총 점수 :{" "}
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
                w="230px"
                _dark={id === study.studyId ? {} : { bg: "dep_3" }}
              >
                {study.ranking <= 3 ? (
                  <Image src={getMedalColor(study.ranking)} w="30px" mr="5px" />
                ) : (
                  <Text w="40px" color="main">
                    {study.ranking}
                  </Text>
                )}
                <Flex
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Text
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    {study.studyName}
                  </Text>
                  <Text fontSize="14px">{study.totalScore}</Text>
                </Flex>
              </Flex>
            </Tooltip>
          </Link>
        );
      })}
    </Box>
  );
}

export default Ranking;
