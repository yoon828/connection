import React, { useEffect, useState } from "react";
import { RepeatIcon } from "@chakra-ui/icons";

import StudyLayout from "../components/layout/StudyLayout";
import SideComponent, {
  RECOMMEND_TAPS
} from "../components/recommend/SideComponent";
import { getRecommend, GetRecommendRes } from "../api/problem";
import ProblemList from "../components/recommend/ProblemList";
import { Problem } from "../@types/Problem";
import Tooltip from "../components/recommend/Tooltip";

function Recommend() {
  const [recommends, setRecommends] = useState<null | GetRecommendRes>(null);
  const [selectedTap, setSelectedTap] = useState(0);

  const onTabClick: React.MouseEventHandler<HTMLDivElement> = e => {
    if (e.target instanceof HTMLDivElement && e.target.dataset.id) {
      const targetId = Number(e.target.dataset.id);
      setSelectedTap(targetId);
    }
  };

  const getAndSetRecommend = async () => {
    const res = await getRecommend();
    setRecommends(res.data);
    console.log(res);
  };

  useEffect(() => {
    getAndSetRecommend();
  }, []);

  return (
    <StudyLayout
      sideComponent={
        <SideComponent selectedTap={selectedTap} onTabClick={onTabClick} />
      }
      title={RECOMMEND_TAPS[selectedTap].label}
      description={RECOMMEND_TAPS[selectedTap].msg}
    >
      <RepeatIcon
        w={10}
        h={10}
        position="absolute"
        top={120}
        right={12}
        cursor="pointer"
        onClick={getAndSetRecommend}
        _hover={{ transform: "rotate(90deg)" }}
        transition="transform .6s"
      />
      {RECOMMEND_TAPS[selectedTap].category === "weak" && (
        <Tooltip recommends={recommends} />
      )}
      {recommends && (
        <ProblemList
          problemList={
            recommends[
              RECOMMEND_TAPS[selectedTap].category as keyof GetRecommendRes
            ] as Problem[]
          }
        />
      )}
    </StudyLayout>
  );
}
export default Recommend;
