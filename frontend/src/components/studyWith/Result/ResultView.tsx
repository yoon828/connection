import { Center } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import NextBtn from "../NextBtn";
import ResultBar, { ResultBarProps } from "./ResultBar";
import ViewTitle from "../ViewTitle";
import {
  ClientToServerEvents,
  ServerToClientEvents
} from "../../../asset/data/socket.type";
import { useAppSelector } from "../../../store/hooks";

type ResultViewProps = {
  onBtnClick: () => void;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

function ResultView({ onBtnClick, socket }: ResultViewProps) {
  const { name } = useAppSelector(({ auth: { information } }) => information);
  const [results, setResults] = useState<ResultBarProps[]>();
  useEffect(() => {
    socket.emit("getResult", setResults);
  }, []);
  return (
    <Center w="1200px" m="auto" flexDir="column">
      <ViewTitle main="풀이 결과" mt={48} mb={0} des="" highLight="" />
      {results &&
        results.map((res, ind) => (
          <ResultBar
            imageUrl={res.imageUrl}
            key={res.name}
            rank={ind + 1}
            name={res.name}
            problem={res.problem}
            time={res.time}
            isMe={res.name === name}
          />
        ))}

      <NextBtn text="다음" mt={0} onBtnClick={onBtnClick} />
    </Center>
  );
}

export default ResultView;
