import { Box, Button, Flex, Link, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { Link as ReactLink } from "react-router-dom";
import HomeworkChart from "./HomeworkChart";
import HomeworkTable from "./HomeworkTable";

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
type DataProps = {
  problems: ProblemProps[];
  users: UserProps[];
  deadline: string[];
};

function HomeworkView() {
  const [isBoss, setIsBoss] = useState(true);
  const [isHomwork, setIshomwork] = useState(false);

  const data: DataProps = {
    problems: [
      {
        problem_id: 100,
        problem_name: "문제이름",
        problem_solved: [true, false, false, true, true, false]
      },
      {
        problem_id: 101,
        problem_name: "문제이름",
        problem_solved: [true, true, true, false, false, false]
      },
      {
        problem_id: 102,
        problem_name: "문제이름",
        problem_solved: [false, true, true, false, true, false]
      },
      {
        problem_id: 103,
        problem_name: "문제이름",
        problem_solved: [true, false, false, false, true, false]
      },
      {
        problem_id: 104,
        problem_name: "문제이름",
        problem_solved: [true, false, false, true, true, true]
      }
    ],
    users: [
      {
        user_id: 1,
        user_name: "김윤민",
        problem_cnt: 3
      },
      {
        user_id: 2,
        user_name: "김윤민",
        problem_cnt: 4
      },
      {
        user_id: 3,
        user_name: "김윤민",
        problem_cnt: 1
      },
      {
        user_id: 4,
        user_name: "김윤민",
        problem_cnt: 2
      },
      {
        user_id: 5,
        user_name: "김윤민",
        problem_cnt: 3
      },
      {
        user_id: 6,
        user_name: "김윤민",
        problem_cnt: 3
      }
    ],
    deadline: ["2022-12-12", "2022-12-20"]
  };

  const series = [2, 4, 5, 5, 6, 4];
  const labels = ["김윤민", "김윤민", "김윤민", "김윤민", "김윤민", "김윤민"];

  return (
    <Flex w="100%" flexDir="column">
      <Flex m="12px" fontSize="14px" flexDir="column">
        <Text fontWeight="bold" mb="5px">
          총 문제수 : 5문제
        </Text>
        <Text>
          과제 기간 :{data.deadline[0]} ~ {data.deadline[1]}
        </Text>
      </Flex>
      <Flex>
        <HomeworkTable problems={data.problems} users={data.users} />
        <HomeworkChart series={series} labels={labels} />
      </Flex>
      {/* {isHomwork ? (
        <Box>현재 진행중 과제 정보</Box>
      ) : isBoss ? (
        <Link as={ReactLink} to="/study/assignment" mb="60px" _hover={{}}>
          <Button bg="gra" width="120px" _hover={{}}>
            과제 추가
          </Button>
        </Link>
      ) : (
        <Text bg="sub" p="10px 20px" borderRadius="10px" boxShadow="md">
          등록된 과제가 없어요😥
        </Text>
      )} */}
    </Flex>
  );
}

export default HomeworkView;
