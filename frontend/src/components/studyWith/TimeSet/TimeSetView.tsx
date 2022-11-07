import { Box, Center, Text } from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Socket } from "socket.io-client";
import getTime from "../../../utils/getTime";
import ViewTitle from "../ViewTitle";
import NextBtn from "../NextBtn";
import { useAppSelector } from "../../../store/hooks";
import ParticipantContainer from "../ParticipantContainer";
import {
  ClientToServerEvents,
  ServerToClientEvents,
  UserProfileType
} from "../../../asset/data/socket.type";
import { getRecommendTimes } from "../../../api/problem";
import TimeProblemContainer from "./TimeProblemContainer";

type TimeSetViewProps = {
  onBtnClick: () => void;
  onPrevBtnClick: () => void;
  participants: UserProfileType[];
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

function TimeSetView({
  onBtnClick,
  onPrevBtnClick,
  participants,
  socket
}: TimeSetViewProps) {
  const [times, setTimes] = useState<Map<string, number>>(new Map());
  const [isLaoding, setIsLoading] = useState(true);
  const { studyName, studyId } = useAppSelector(
    ({ auth: { information } }) => ({
      studyName: information.studyName,
      studyId: information.studyId
    })
  );
  const selectedProblems = useAppSelector(
    ({ selectedProblem }) => selectedProblem.selectedProblemList
  );
  const [problems, setProblems] = useState<
    { recommendTime: number; problemId: number; title: string; level: number }[]
  >(selectedProblems.map(p => ({ ...p.problemInfo, recommendTime: 0 })));

  const totalTime = useMemo(() => {
    let total = 0;
    let flag = false;
    times.forEach(time => {
      if (time > 180) {
        flag = true;
      }
      total += time;
    });
    if (flag) return "문제당 최대 3시간으로 설정해주세요";
    return getTime(total * 60);
  }, [times]);

  const handleTimes = useCallback(
    (id: string, time: number) => setTimes(prev => new Map(prev).set(id, time)),
    []
  );

  const handleNextBtnClick = () => {
    let duringTime = 0;
    times.forEach(time => {
      duringTime += time;
    });
    socket.emit(
      "startStudy",
      studyId,
      problems.map(problem => ({
        problemId: problem.problemId,
        title: problem.title,
        level: problem.level
      })),
      duringTime,
      () => onBtnClick()
    );
  };

  useEffect(() => {
    (async () => {
      const res = await getRecommendTimes(
        selectedProblems.map(problem => problem.problemInfo.problemId)
      );
      const recommendTimes = res.data.time;
      const newTimes = new Map();
      // eslint-disable-next-line no-restricted-syntax
      for (const id in recommendTimes) {
        if (Object.prototype.hasOwnProperty.call(recommendTimes, id)) {
          newTimes.set(id, recommendTimes[id]);
        }
      }
      setProblems(prev =>
        prev.map(p => {
          return { ...p, recommendTime: newTimes.get(`${p.problemId}`) };
        })
      );
      setTimes(newTimes);
      setIsLoading(false);
    })();
  }, []);

  return (
    <Center w="1200px" m="auto" flexDir="column">
      <Box w="800px" pos="absolute" top="108px">
        <ArrowBackIcon
          w="32px"
          h="32px"
          cursor="pointer"
          onClick={onPrevBtnClick}
        />
      </Box>

      <ViewTitle
        main="문제 풀이 시간"
        mt={60}
        mb={10}
        des={`${studyName} 과 함께 풀 문제 개수를 선택해주세요`}
        highLight={`${studyName}`}
      />
      <ParticipantContainer users={participants} />
      {!isLaoding && (
        <>
          <Box mt="16px">
            {problems.map(problem => (
              <TimeProblemContainer
                key={problem.problemId}
                title={problem.title}
                id={problem.problemId}
                recommendTime={problem.recommendTime}
                setTimes={handleTimes}
              />
            ))}
          </Box>
          <Center h="90px" mb="12px">
            <Text
              fontSize={
                `${totalTime}` === "문제당 최대 3시간으로 설정해주세요"
                  ? "40px"
                  : "60px"
              }
            >
              {totalTime}
            </Text>
          </Center>
          <NextBtn text="다음" mt={0} onBtnClick={handleNextBtnClick} />
        </>
      )}
    </Center>
  );
}

export default TimeSetView;
