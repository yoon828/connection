import { Center } from "@chakra-ui/react";

import React, { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import axios from "axios";
import NextBtn from "../NextBtn";
import ReviewBar from "./ReviewBar";
import ViewTitle from "../ViewTitle";
import {
  ClientToServerEvents,
  ProblemType,
  ServerToClientEvents
} from "../../../asset/data/socket.type";
import { registReview } from "../../../api/studyJoin";

type ReviewViewProps = {
  onBtnClick: () => void;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
};

function ReviewView({ onBtnClick, socket }: ReviewViewProps) {
  const [tiers, setTiers] = useState<Map<number, string>>(new Map());
  const [problems, setProblems] = useState<ProblemType[]>();

  useEffect(() => {
    socket.emit("getSolvingInfo", (problemList, _) => {
      setProblems(problemList);
      const initTier = new Map<number, string>();
      problemList.map(problem =>
        initTier.set(problem.problemId, `${problem.level}`)
      );
      setTiers(initTier);
    });
  }, []);

  const handleOnBtnClick = async () => {
    const reviews: { problemId: string; difficulty: string }[] = [];
    tiers.forEach((value, key) => {
      reviews.push({ problemId: `${key}`, difficulty: value });
    });
    const res = await registReview(reviews);
    // if(!axios.re)
    if (!axios.isAxiosError(res)) {
      // console.log(res.data);
      if (res.data.msg === "success") {
        onBtnClick();
      }
    }
    // console.log(reviews);
  };

  return (
    <Center w="1200px" m="auto" flexDir="column">
      <ViewTitle
        main="문제 리뷰"
        des="문제에 대한 리뷰 및 평가를 입력해주세요"
        mt={40}
        mb={32}
        highLight=""
        desSize={20}
      />
      {problems &&
        problems.map(problem => (
          <ReviewBar
            level={problem.level}
            key={problem.problemId}
            name={problem.title}
            id={problem.problemId}
            setTiers={(id: number, tier: string) =>
              setTiers(prev => new Map(prev).set(id, tier))
            }
          />
        ))}
      <NextBtn text="완료" mt={40} onBtnClick={handleOnBtnClick} />
    </Center>
  );
}

export default ReviewView;
