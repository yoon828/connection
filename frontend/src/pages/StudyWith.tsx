import { Center, CircularProgress } from "@chakra-ui/react";
import React, { useState } from "react";
import { v4 } from "uuid";
import NumberSetView from "../components/studyWith/NumberSetView";
import ProblemSetView from "../components/studyWith/ProblemSetView";
import ResultView from "../components/studyWith/ResultView";
import ReviewView from "../components/studyWith/ReviewView";
import SolvingView from "../components/studyWith/SolvingView";
import TimeSetView from "../components/studyWith/TimeSetView";

function StudyWith() {
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

  return (
    <Center>
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
