import { Center } from "@chakra-ui/react";
import React from "react";
import NextBtn from "../NextBtn";
import ResultBar, { ResultBarProps } from "./ResultBar";
import ViewTitle from "../ViewTitle";

type ResultViewProps = {
  onBtnClick: () => void;
};

function ResultView({ onBtnClick }: ResultViewProps) {
  const dummy: ResultBarProps[] = [
    { name: "진호짱짱", problem: 2, time: 60 },
    { name: "우건공듀", problem: 2, time: 60 },
    { name: "진합왕자", problem: 2, time: 120 },
    { name: "기영왕자", problem: 2, time: 130 },
    { name: "윤민공듀", problem: 2, time: 140 },
    { name: "준우왕자", problem: 2, time: 160 }
  ];

  return (
    <Center w="1200px" m="auto" flexDir="column">
      <ViewTitle main="풀이 결과" mt={48} mb={0} des="" highLight="" />
      {dummy &&
        dummy.map((d, ind) => (
          <ResultBar
            key={d.name}
            rank={ind + 1}
            name={d.name}
            problem={d.problem}
            time={d.time}
            isMe={d.name === "우건공듀"}
          />
        ))}

      <NextBtn text="다음" mt={0} onBtnClick={onBtnClick} />
    </Center>
  );
}

export default ResultView;
