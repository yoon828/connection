import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { getSubject } from "../../../api/study";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import Subject from "./Subject";
import NoSubject from "./NoSubject";
import SliderLayout from "../../layout/SliderLayout";
import { updateUserInfo } from "../../../store/ducks/auth/authSlice";

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
  const dispatch = useAppDispatch();
  const [isProgress, setIsProgress] = useState(false);
  const [subjectList, setSubjectList] = useState<SubjectProps[]>([]);
  const [len, setLen] = useState(0);

  const getSubjectApi = async () => {
    const {
      data: { inProgress, subjects, leader }
    } = await getSubject();
    // console.log(inProgress);
    // console.log(subjects);
    dispatch(updateUserInfo({ studyLeader: leader }));
    setIsProgress(inProgress);
    setSubjectList(subjects);
    setLen(isProgress ? subjects.length - 1 : subjects.length);
  };

  useEffect(() => {
    getSubjectApi();
  }, []);

  if (len !== 0) {
    return (
      <SliderLayout total={len}>
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
  return null;
}

export default SubjectkView;
