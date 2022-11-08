import React from "react";

import Tap from "./Tab";

export const RECOMMEND_TAPS = [
  {
    id: 0,
    label: "많이 푼 문제",
    msg: "자주 출제되는 유형 중/다른 사람들이 많이 푼 문제들을 추천해 줄게요. ",
    category: "popular"
  },
  {
    id: 1,
    label: "많이 담은 문제",
    msg: "어떤 문제를 같이 풀지 모르겠어요?/다른 스터디가 문제집에 담아놓은 문제들을 추천해 줄게요. ",
    category: "workbook"
  },
  {
    id: 2,
    label: "많이 안 푼 유형",
    msg: "자주 출제되는 유형 중/많이 안 푼 유형의 문제들을 추천해 줄게요. ",
    category: "weak"
  }
];
interface SideComponentProps {
  selectedTap: number;
  onTabClick: React.MouseEventHandler<HTMLDivElement>;
}

function SideComponent({ selectedTap, onTabClick }: SideComponentProps) {
  return (
    <>
      {RECOMMEND_TAPS.map((tab, idx) => (
        <Tap
          key={tab.id}
          id={tab.id}
          label={tab.label}
          isSelected={idx === selectedTap}
          onTabClick={onTabClick}
        />
      ))}
    </>
  );
}

export default SideComponent;
