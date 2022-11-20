import { Center } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import NextBtn from "../NextBtn";
import ReviewBar from "./ReviewBar";
import ViewTitle from "../ViewTitle";
import { registReview } from "../../../api/studyJoin";
import { ServerProblemType } from "../../../asset/data/socket.type";
import { useAppSelector } from "../../../store/hooks";

type ReviewViewProps = {
  onBtnClick: () => void;
  solvingProblmes: ServerProblemType[];
};

function ReviewView({ onBtnClick, solvingProblmes }: ReviewViewProps) {
  const [tiers, setTiers] = useState<Map<number, string>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const bojId = useAppSelector(
    ({ auth }) => auth.information.backjoonId
  ) as string;
  useEffect(() => {
    const initTier = new Map<number, string>();
    solvingProblmes.map(problem =>
      initTier.set(problem.problemId, `${problem.level}`)
    );
    setTiers(initTier);
    setIsLoading(false);
  }, []);

  const handleOnBtnClick = async () => {
    const reviews: { problemId: string; difficulty: string }[] = [];
    tiers.forEach((value, key) => {
      reviews.push({ problemId: `${key}`, difficulty: value });
    });
    const res = await registReview(reviews, bojId);
    if (!axios.isAxiosError(res)) {
      if (res.data.msg === "success") {
        onBtnClick();
      }
    }
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
      {!isLoading &&
        solvingProblmes.map(problem => (
          <ReviewBar
            level={problem.level}
            key={problem.problemId}
            title={problem.title}
            problemId={problem.problemId}
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
