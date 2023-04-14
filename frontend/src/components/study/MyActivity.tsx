import React, { useState, useEffect, useRef } from "react";
import { Center } from "@chakra-ui/react";
import { getMyActivity } from "../../api/study";
import useIntersectionObsever from "../../hooks/useIntersectionObserver";
import PercentChart from "./PercentChart";

export type ContentProps = {
  my: number;
  total: number;
};

const init: ContentProps = {
  my: 0,
  total: 0
};

function MyActivity() {
  const [subject, setSubject] = useState<ContentProps>(init); // 과제
  const [problems, setProblems] = useState<ContentProps>(init); // 스터디 전체 문제
  const ref = useRef<HTMLDivElement | null>(null);
  const inInViewport = useIntersectionObsever(ref);

  const getMyActivityApi = async () => {
    const {
      data: {
        data: {
          solvedSubject,
          totalSubject,
          solvedStudyProblem,
          totalStudyProblem
        }
      }
    } = await getMyActivity();
    setSubject({ my: solvedSubject, total: totalSubject });
    setProblems({ my: solvedStudyProblem, total: totalStudyProblem });
  };

  useEffect(() => {
    getMyActivityApi();
  }, []);

  return (
    <Center w="100%" ref={ref}>
      <PercentChart title="과제" content={inInViewport ? subject : init} />
      <PercentChart title="문제" content={inInViewport ? problems : init} />
    </Center>
  );
}

export default MyActivity;
