import React, { useEffect, useState } from "react";
import { Link as ReactLink, Navigate, useNavigate } from "react-router-dom";
import { CopyIcon, QuestionIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  Link,
  Text,
  Tooltip,
  useClipboard,
  useColorMode
} from "@chakra-ui/react";

import useToast from "hooks/useToast";
import { getMemberList } from "api/study";
import { v4 } from "uuid";
import TotalLayout from "../../components/layout/TotalLayout";
import Ranking from "../../components/study/Ranking";
import GithubL from "../../asset/img/githubL.svg";
import GithubD from "../../asset/img/githubD.svg";
import MyActivity from "../../components/study/MyActivity";
import Challenge from "../../components/study/Challenge";
import { useAppSelector } from "../../store/hooks";
import { UserInfoType } from "../../store/ducks/auth/auth.type";
import SubjectView from "../../components/study/subject/SubjectView";

type UserListProps = Pick<
  UserInfoType,
  "name" | "userId" | "imageUrl" | "githubId"
>;

function RankInfo() {
  return (
    <Tooltip
      label={
        <div>
          과제점수 : 스터디장이 등록한 과제 문제
          <br />
          문제풀이 점수 : 스터디원들과 같이 문제 풀이
          <br />
          보너스 점수 : 꾸준함에 따른 점수 <br />
        </div>
      }
    >
      <QuestionIcon w={6} h={6} cursor="help" />
    </Tooltip>
  );
}

function StudyTotal() {
  const [users, setUsers] = useState<UserListProps[]>([]);
  const { colorMode } = useColorMode();
  const info: UserInfoType = useAppSelector(state => state.auth.information);
  const { onCopy } = useClipboard(info.studyCode);
  const toast = useToast();

  function onCopyEvent() {
    onCopy();
    toast({
      title: "스터디 코드를 복사했습니다!",
      status: "success",
      isClosable: true,
      position: "top"
    });
  }

  const getUserList = async () => {
    const { data } = await getMemberList();
    setUsers(data);
  };

  useEffect(() => {
    getUserList();
  }, []);

  return (
    <Box
      bg="dep_1"
      m="40px auto"
      borderRadius="20px"
      boxShadow="md"
      width="800px"
    >
      <Center
        height="110px"
        justifyContent="space-between"
        borderBottom="1px solid #BFBFBF"
      >
        <Flex direction="column" ml="20px">
          <Flex mb="5px" alignItems="center">
            <Heading fontSize="20px" fontWeight="bold" mr="5px">
              {info.studyName}
            </Heading>
            <Link href={info.studyRepository} isExternal>
              <Image src={colorMode === "light" ? GithubL : GithubD} w="20px" />
            </Link>
          </Flex>
          <Text fontSize="14px" display="flex" alignItems="center">
            스터디 코드 : {info.studyCode}
            <CopyIcon mx="3px" onClick={() => onCopyEvent()} cursor="pointer" />
          </Text>
          <Flex h="35px">
            {users &&
              users.map(user => (
                <Tooltip key={v4()} label={user.name}>
                  <Image
                    m="5px 5px 0 0"
                    src={user.imageUrl}
                    borderRadius="50px"
                    minW="30px"
                    w="30px"
                  />
                </Tooltip>
              ))}
          </Flex>
        </Flex>

        <Flex dir="row">
          <Link as={ReactLink} to="/study/collection">
            <Button bg="gra" mr="20px" _hover={{}}>
              문제집
            </Button>
          </Link>
          <Link as={ReactLink} to="/study/management">
            <Button bg="gra" mr="20px" _hover={{}}>
              스터디 관리
            </Button>
          </Link>
        </Flex>
      </Center>
      <Box p="20px">
        <Flex>
          <TotalLayout
            title="챌린지"
            flex="3"
            height="200px"
            mr="10px"
            end="flex-end"
          >
            <Challenge />
          </TotalLayout>
          <TotalLayout
            title="랭킹"
            flex="2"
            height="200px"
            RankInfo={<RankInfo />}
          >
            <Ranking />
          </TotalLayout>
        </Flex>
        <TotalLayout title="과제 현황" height="300px">
          <SubjectView />
        </TotalLayout>
        <TotalLayout title="내 풀이 현황" height="300px">
          <MyActivity />
        </TotalLayout>
      </Box>
    </Box>
  );
}

export default StudyTotal;
