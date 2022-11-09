import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { getSubject } from "../../../api/study";
import { useAppSelector } from "../../../store/hooks";
import Subject from "./Subject";
import NoSubject from "./NoSubject";
import SliderLayout from "../../layout/SliderLayout";

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
  const studyRole = useAppSelector(state => state.auth.information.studyRole);
  const [isProgress, setIsProgress] = useState(false);
  const [subjectList, setSubjectList] = useState<SubjectProps[]>([]);

  const getSubjectApi = async () => {
    const {
      data: { inProgress, subjects }
    } = await getSubject();
    // console.log(subjects);
    // console.log(inProgress);
    setIsProgress(inProgress);
    setSubjectList(subjects);
  };

  useEffect(() => {
    getSubjectApi();
  }, []);

  return (
    <SliderLayout
      total={isProgress ? subjectList.length - 1 : subjectList.length}
    >
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
      {!isProgress && <NoSubject studyRole={studyRole} />}
    </SliderLayout>
  );
}

export default SubjectkView;
