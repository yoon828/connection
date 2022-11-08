import { Center, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerProblemType,
  ServerToClientEvents
} from "../../../asset/data/socket.type";
import { useAppSelector } from "../../../store/hooks";
import getTime from "../../../utils/getTime";
import NextBtn from "../NextBtn";
import ViewTitle from "../ViewTitle";
import ProblemBar, { ProblemBarProps } from "./ProblemBar";

type TimerProps = {
  initTime: number;
};

function Timer({ initTime }: TimerProps) {
  const [time, setTime] = useState(initTime);
  const [timerId, setTimerId] = useState<ReturnType<
    typeof setTimeout
  > | null>();

  useEffect(() => {
    if (!timerId) {
      const nextTimerId = setTimeout(() => {
        setTimerId(null);
        setTime(prev => prev - 1);
      }, 1000);
      setTimerId(nextTimerId);
    }
  }, [time]);

  return (
    <Text fontSize="100px" mt="60px" textAlign="center">
      {getTime(time)}
    </Text>
  );
}

type SolvingViewProps = {
  onBtnClick: () => void;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  solvingProblmes: ServerProblemType[];
  setSolvingProblems: (promblems: ServerProblemType[]) => void;
};

function SolvingView({
  onBtnClick,
  socket,
  solvingProblmes,
  setSolvingProblems
}: SolvingViewProps) {
  const [isLaoding, setIsLoading] = useState(true);
  const [remainTime, setRemainTime] = useState(0);
  const baekjoonId = useAppSelector(({ auth }) => auth.information.backjoonId);

  useEffect(() => {
    socket.emit("getSolvingInfo", (problemList, time) => {
      setRemainTime(time);
      setSolvingProblems(problemList);
      setIsLoading(false);
    });
    socket.on("solvedByExtension", (bojId, problemNo, allSol) => {
      if (allSol) onBtnClick();
      if (baekjoonId === bojId) {
        setSolvingProblems(
          solvingProblmes?.map(problem => {
            if (problem.problemId === problemNo) {
              return { ...problem, isSolved: true };
            }
            return problem;
          })
        );
      }
    });
  }, []);

  return (
    <Center w="1200px" m="auto" flexDir="column">
      {isLaoding ? (
        <Text fontSize="100px" mt="60px" textAlign="center">
          - - : - - : - -
        </Text>
      ) : (
        <Timer initTime={remainTime} />
      )}

      <ViewTitle
        main="문제 풀이"
        des="문제를 풀었으면 확인버튼을 눌러주세요."
        highLight=""
        mt={12}
        mb={60}
        desSize={20}
      />
      {!isLaoding && (
        <>
          {solvingProblmes?.map(problem => (
            <ProblemBar
              key={problem.problemId}
              title={problem.title}
              isSolved={problem.isSolved}
              problemId={problem.problemId}
            />
          ))}
          <NextBtn text="다음" mt={20} onBtnClick={onBtnClick} />
        </>
      )}
    </Center>
  );
}

export default SolvingView;
