import { Center } from "@chakra-ui/react";

import React, { useState } from "react";
import NextBtn from "../NextBtn";
import ReviewBar from "./ReviewBar";
import ViewTitle from "../ViewTitle";

type ReviewViewProps = {
  onBtnClick: () => void;
};

function ReviewView({ onBtnClick }: ReviewViewProps) {
  const dummy = [
    { name: "지뢰를 찾아서", id: 212 },
    { name: "미로탈출", id: 2321 },
    { name: "무슨 열차 999", id: 726 }
  ];
  const [tiers, setTiers] = useState<Map<number, string>>(new Map());

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
      {dummy &&
        dummy.map((d, ind) => (
          <ReviewBar
            key={d.name}
            name={d.name}
            id={d.id}
            setTiers={(id: number, tier: string) =>
              setTiers(prev => new Map(prev).set(id, tier))
            }
          />
        ))}
      <NextBtn text="다음" mt={40} onBtnClick={onBtnClick} />
    </Center>
  );
}

export default ReviewView;
