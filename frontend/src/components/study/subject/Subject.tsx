import React, { useEffect, useState } from "react";
import { Flex, Text } from "@chakra-ui/react";
import SubjectChart from "./SubjectChart";
import SubjectTable from "./SubjectTable";
import { SubjectProps } from "./SubjectView";

function Subject({ problems, users, deadline }: SubjectProps) {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setlabels] = useState<string[]>([]);
  useEffect(() => {
    const seriesTmp: number[] = [];
    const labelsTmp: string[] = [];
    users.map(user => {
      seriesTmp.push(user.problem_cnt);
      return labelsTmp.push(user.user_name);
    });
    setSeries(seriesTmp);
    setlabels(labelsTmp);
  }, []);

  return (
    <Flex w="100%" flexDir="column" flex="none" p="6px 30px">
      <Flex m="12px" fontSize="14px" flexDir="column">
        <Text fontWeight="bold" mb="5px">
          총 문제수 : {problems.length}문제
        </Text>
        <Text>
          과제 기간 :{deadline[0]} ~ {deadline[1]}
        </Text>
      </Flex>
      <Flex>
        <SubjectTable problems={problems} users={users} />
        <SubjectChart series={series} labels={labels} />
      </Flex>
    </Flex>
  );
}

export default Subject;
