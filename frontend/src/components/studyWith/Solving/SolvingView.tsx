import { Center, Text } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerProblemType,
  ServerToClientEvents
} from "../../../asset/data/socket.type";
import { useAppSelector } from "../../../store/hooks";
import getTime from "../../../utils/getTime";
import ViewTitle from "../ViewTitle";
import ProblemBar from "./ProblemBar";

type TimerProps = {
  initTime: number;
};

function Timer({ initTime }: TimerProps) {
  const [time, setTime] = useState(initTime);
  const timerId = useRef<NodeJS.Timeout>();
  useEffect(() => {
    timerId.current = setInterval(() => {
      if (time > 0) {
        setTime(prev => prev - 1);
      } else {
        clearInterval(timerId.current);
      }
    }, 1000);
  }, []);

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
    socket.emit("getSolvingInfo", (problemList, time, allSol) => {
      if (allSol) onBtnClick();
      setRemainTime(time);
      setSolvingProblems(problemList);
      setIsLoading(false);
    });
    socket.on("solvedByExtension", (bojId, problemList, allSol) => {
      if (baekjoonId === bojId) {
        if (allSol) onBtnClick();
        setSolvingProblems(problemList);
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
          {/* <NextBtn text="다음" mt={20} onBtnClick={onBtnClick} /> */}
        </>
      )}
    </Center>
  );
}

export default SolvingView;
