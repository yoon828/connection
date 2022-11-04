import React, { useEffect, useState } from "react";
import { Flex } from "@chakra-ui/react";
import { v4 } from "uuid";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getSubject } from "../../../api/study";
import { useAppSelector } from "../../../store/hooks";
import Subject from "./Subject";

export type ProblemProps = {
  problem_id: number;
  problem_name: string;
  problem_solved: boolean[];
};
export type UserProps = {
  user_id: number;
  user_name: string;
  problem_cnt: number;
};

export type SubjectProps = {
  problems: ProblemProps[];
  users: UserProps[];
  deadline: string[];
};

function SubjectkView() {
  const role = useAppSelector(state => state.auth.information.studyRole);
  const [isProgress, setIsProgress] = useState(false);
  const [subjectList, setSubjectList] = useState<SubjectProps[]>([]);

  const getSubjectApi = async () => {
    const {
      data: { inProgress, subjects }
    } = await getSubject();
    setIsProgress(inProgress);
    setSubjectList(subjects);
  };

  useEffect(() => {
    getSubjectApi();
  }, []);

  const settings: Settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    rtl: true
  };

  return (
    <Flex w="100%" flexDir="column" p="0 35px">
      <Slider {...settings}>
        {subjectList.map(subject => {
          return (
            <Subject
              problems={subject.problems}
              users={subject.users}
              deadline={subject.deadline}
              key={v4()}
            />
          );
        })}
        <div>
          <h3>마지막</h3>
        </div>
      </Slider>
    </Flex>
  );
}

export default SubjectkView;
