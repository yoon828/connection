import React, { useEffect, useState } from "react";

import StudyLayout from "../../components/layout/StudyLayout";
import SideComponent, {
  RECOMMEND_TAPS
} from "../../components/recommend/SideComponent";
import { getRecommend, GetRecommendRes } from "../../api/problem";
import ProblemList from "../../components/recommend/ProblemList";
import { Problem } from "../../@types/Problem";
import Tooltip from "../../components/recommend/Tooltip";
import Style from "./index.style";

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
      <Style.StyledIcon onClick={getAndSetRecommend} />
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
