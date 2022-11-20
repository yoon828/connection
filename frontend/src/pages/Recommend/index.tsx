import React, { useEffect, useState } from "react";

import { Flex, keyframes, Spinner } from "@chakra-ui/react";
import Filter from "components/recommend/Filter";
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
  const [pending, setPending] = useState(false);
  const [selectedTap, setSelectedTap] = useState(0);

  const getAndSetRecommend = async (level?: string, tag?: string) => {
    if (pending) return;
    setPending(true);
    const res1 = await getRecommend(level, tag);
    setRecommends(res1.data);
    setPending(false);
  };
  const onTabClick: React.MouseEventHandler<HTMLDivElement> = e => {
    if (e.target instanceof HTMLDivElement && e.target.dataset.id) {
      const targetId = Number(e.target.dataset.id);
      setSelectedTap(targetId);
    }
  };

  useEffect(() => {
    (async () => {
      await getAndSetRecommend();
    })();
  }, []);
  const animation = keyframes`
  0%{
    transform: rotate(90deg);
  }
  100% {
      transform: rotate(450deg);
  }
`;
  return (
    <StudyLayout
      sideComponent={
        <SideComponent selectedTap={selectedTap} onTabClick={onTabClick} />
      }
      title={RECOMMEND_TAPS[selectedTap].label}
      description={RECOMMEND_TAPS[selectedTap].msg}
    >
      <Style.StyledIcon
        onClick={() => getAndSetRecommend()}
        animation={pending ? `${animation} ease-in-out infinite 1s` : "none"}
        _hover={{ transform: pending ? "none" : "rotate(90deg)" }}
      />
      {RECOMMEND_TAPS[selectedTap].category === "weak" && (
        <Tooltip recommends={recommends} />
      )}
      {RECOMMEND_TAPS[selectedTap].category === "popular" && (
        <Filter fetch={getAndSetRecommend} />
      )}
      {recommends ? (
        <ProblemList
          problemList={
            recommends[
              RECOMMEND_TAPS[selectedTap].category as keyof GetRecommendRes
            ] as Problem[]
          }
        />
      ) : (
        <Flex justifyContent="center" alignItems="center" h="500px">
          <Spinner color="main" size="xl" />
        </Flex>
      )}
    </StudyLayout>
  );
}
export default Recommend;
