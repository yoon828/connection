import React from "react";
import {
  Circle,
  Link,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr
} from "@chakra-ui/react";
import { v4 } from "uuid";
import { ProblemProps, UserProps } from "./SubjectView";
import { useAppSelector } from "../../../store/hooks";

type SubjectTableProps = {
  problems: ProblemProps[];
  users: UserProps[];
  flex: number;
};

function SubjectTable({ problems, users, flex }: SubjectTableProps) {
  const studyLeader = useAppSelector(
    state => state.auth.information.studyLeader
  );
  return (
    <TableContainer
      pr="20px"
      borderRight="0.5px solid"
      borderColor="border_gray"
      flex={flex}
    >
      <Table variant="unstyled" size="sm">
        <Thead>
          <Tr>
            <Th
              textAlign="center"
              color="inherit"
              borderRight="0.5px solid"
              borderBottom="0.5px solid"
              borderColor="border_gray"
              w="13%"
            >
              번호
            </Th>
            {users.map(user => {
              return (
                <Th
                  key={v4()}
                  textAlign="center"
                  color="inherit"
                  borderBottom="0.5px solid"
                  borderColor="border_gray"
                  w={`${100 / users.length}%`}
                >
                  {user.user_name}
                </Th>
              );
            })}
          </Tr>
        </Thead>
        <Tbody>
          {problems.map(problem => {
            return (
              <Tr key={v4()}>
                <Td
                  borderRight="0.5px solid"
                  borderColor="border_gray"
                  textAlign="center"
                  w="13%"
                >
                  <Tooltip label={problem.problem_name} placement="right">
                    <Link
                      href={`https://www.acmicpc.net/problem/${problem.problem_id}`}
                      isExternal
                    >
                      {problem.problem_id}
                    </Link>
                  </Tooltip>
                </Td>
                {problem.problem_solved.map(solved => {
                  return (
                    <Td key={v4()} textAlign="center">
                      <Link
                        href={`https://github.com/co-nnection/${studyLeader}/tree/main/${problem.problem_id}`}
                        cursor={solved ? "pointer" : "default"}
                        pointerEvents={solved ? "auto" : "none"}
                        w={`${100 / users.length}%`}
                      >
                        <Circle
                          size="20px"
                          bg={solved ? "solved" : "dep_3"}
                          m="auto"
                        />
                      </Link>
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}

export default SubjectTable;
