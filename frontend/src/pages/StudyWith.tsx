import { Center, CircularProgress } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import { io } from "socket.io-client";
import NumberSetView from "../components/studyWith/NumberSetView";
import ProblemSetView from "../components/studyWith/ProblemSetView";
import ResultView from "../components/studyWith/ResultView";
import ReviewView from "../components/studyWith/ReviewView";
import SolvingView from "../components/studyWith/SolvingView";
import TimeSetView from "../components/studyWith/TimeSetView";

function StudyWith() {
  const socket = io(
    process.env.NODE_ENV === "development"
      ? "localhost:8000"
      : "wss://k7c202.p.ssafy.io:8000",
    { transports: ["websocket"] }
  );

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBoss, setIsBoss] = useState(false);

  const bossView: React.FunctionComponentElement<undefined>[] = [
    <NumberSetView key={v4()} onBtnClick={() => setStep(1)} />,
    <ProblemSetView key={v4()} onBtnClick={() => setStep(2)} />,
    <TimeSetView
      key={v4()}
      onBtnClick={() => setStep(3)}
      onPrevBtnClick={() => setStep(1)}
    />,
    <SolvingView key={v4()} onBtnClick={() => setStep(4)} />,
    <ResultView key={v4()} onBtnClick={() => setStep(5)} />,
    <ReviewView key={v4()} onBtnClick={() => setStep(1)} />
  ];

  useEffect(() => {
    // socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  const test = (e: ChangeEvent<HTMLInputElement>) => {
    socket.emit("chat", e.target.value);
  };
  return (
    <Center>
      <input onChange={test} />
      {isLoading ? (
        <CircularProgress size="120px" mt="30vh" isIndeterminate color="main" />
      ) : (
        <Center>
          {bossView.map((view, ind) => {
            return ind === step && view;
          })}
        </Center>
      )}
    </Center>
  );
}

export default StudyWith;
