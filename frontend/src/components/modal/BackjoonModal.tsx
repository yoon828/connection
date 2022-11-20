import React, { useState } from "react";
import { CopyIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  Input,
  Link,
  ModalBody,
  Text,
  useClipboard,
  Spinner,
  Heading,
  Image
} from "@chakra-ui/react";
import axios from "axios";
import useToast from "hooks/useToast";
import { getUserProblems, postBJConfirm, postBJSolved } from "../../api/auth";
import { useAppDispatch } from "../../store/hooks";
import { updateUserInfo } from "../../store/ducks/auth/authSlice";
import BjDesc from "../../asset/img/bjDesc.png";

type BackjoonModalProps = {
  code: string;
};

type BJPromblemProps = {
  acceptedUserCount: number;
  averageTries: number;
  givesNoRating: boolean;
  isLevelLocked: boolean;
  isPartial: boolean;
  isSolvable: boolean;
  level: number;
  official: boolean;
  problemId: number;
  sprout: boolean;
  tags: any[];
  titleKo: string;
  titles: any[];
  votedUserCount: number;
};

function BackjoonModal({ code }: BackjoonModalProps) {
  const [id, setId] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [confirmMsg, setConfirmMsg] = useState("");
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const { onCopy } = useClipboard(code);
  const toast = useToast();
  const dispatch = useAppDispatch();

  const onCopyEvent = () => {
    onCopy();
    toast({
      title: "인증 코드를 복사했습니다!",
      status: "success",
      isClosable: true,
      position: "top",
      duration: 1000
    });
  };

  // 사용자가 백준에 존재하는 id인지 확인
  const onConfirmUser = async () => {
    try {
      await axios.get(`https://solved.ac/api/v3/user/show?handle=${id}`);
      setVisible(true);
      setUserMsg("");
    } catch (error) {
      setVisible(false);
      setUserMsg("해당 사용자가 존재하지 않습니다.");
    }
    setConfirmMsg("");
  };

  const postSolved = async () => {
    // 백준에서 푼 문제 가져오기
    const res = await getUserProblems(id, 1);
    const total = res.data.count;
    const range = Array.from({ length: total / 50 + 1 }, (v, i) => i + 1);
    const alls = await Promise.all(
      range.map(async params => getUserProblems(id, params))
    );
    const solved: number[] = [];
    alls.map(data =>
      data.data.items.map((item: BJPromblemProps) =>
        solved.push(item.problemId)
      )
    );
    // 푼 문제 보내기
    const resSolved = await postBJSolved(id, { list: solved });
    if (resSolved.msg === "success") {
      toast({
        title: "백준 인증 성공했습니다!",
        position: "top",
        duration: 1000
      });

      // redux 수정하기
      dispatch(updateUserInfo({ backjoonId: id }));
      setLoading(false);
      setReady(true);
    }
  };

  const onFinish = async () => {
    if (loading) return;
    setLoading(true);

    // 백준 연동 확인
    try {
      const data = await postBJConfirm({
        baekjoonId: id,
        code
      });
      if (data.msg === "success") {
        // 인증 된 경우만 풀었던 문제 보내기
        await postSolved();
      }
    } catch (error) {
      console.log(error);
      setConfirmMsg("인증에 실패했습니다");
      setReady(false);
      setLoading(false);
    }
  };

  const onChangeInput = (target: EventTarget & HTMLInputElement) => {
    setId(target.value);
    setVisible(false);
  };

  return (
    <ModalBody p="50px">
      <Heading fontSize="30px" fontWeight="bold">
        백준 연동
      </Heading>
      <Text fontSize="14px">
        connection는 백준에서 사용자가 풀었던 문제를 가져와서 문제 추천하는데
        쓰이고 있어요!
      </Text>
      <Center p="30px 0 0" flexDir="column">
        <Image src={BjDesc} alt="bj" mb="20px" borderRadius="10px" />
        <Flex w="350px" mb="10px">
          <Flex w="70px" h={10} fontSize="18px" alignItems="center">
            백준ID
          </Flex>
          <Flex direction="column" mr="20px">
            <Input
              type="text"
              value={id}
              placeholder="백준 ID를 입력해주세요"
              onChange={e => onChangeInput(e.target)}
            />
            <Text fontSize={12} mt="5px" color="red" h="20px">
              {userMsg}
            </Text>
          </Flex>
          {!visible && (
            <Button
              bg="gra"
              width="60px"
              _hover={{}}
              _active={{}}
              onClick={onConfirmUser}
            >
              확인
            </Button>
          )}
        </Flex>
        {visible && (
          <Center flexDir="column">
            <Flex w="350px" mb="30px">
              <Flex w="70px" h={10} fontSize="18px" alignItems="center">
                Code
              </Flex>
              <Flex direction="column">
                <Flex
                  fontSize={20}
                  h={10}
                  fontWeight="bold"
                  color="main"
                  align="center"
                >
                  {code}
                  <CopyIcon
                    color="black"
                    _dark={{ color: "white" }}
                    boxSize="15px"
                    mx="3px"
                    onClick={onCopyEvent}
                    cursor="pointer"
                  />
                </Flex>
                <Text fontSize={12} my="10px">
                  Solved.ac 프로필 편집 {">"} 상태메시지를
                  <br /> Code로 변경한 뒤,{" "}
                  <Text
                    as="span"
                    color="main"
                    display="inline"
                    fontWeight="bold"
                  >
                    인증
                  </Text>{" "}
                  버튼을 눌러주세요
                </Text>
                <Link
                  href={`https://solved.ac/profile/${id}`}
                  isExternal
                  fontSize={12}
                  display="flex"
                  alignItems="center"
                  textDecorationLine="underline"
                  pointerEvents={id === "" ? "none" : "auto"}
                  fontWeight="bold"
                >
                  Solved.ac로 이동하기
                  <ExternalLinkIcon mx="2px" />
                </Link>
                <Text
                  fontSize={12}
                  mt="5px"
                  color={ready ? "green" : "red"}
                  h="20px"
                >
                  {confirmMsg}
                </Text>
              </Flex>
            </Flex>
            <Button
              bg="gra"
              width="100px"
              _hover={{}}
              _active={{}}
              disabled={id === "" || loading}
              onClick={onFinish}
            >
              {loading ? <Spinner /> : "인증"}
            </Button>
          </Center>
        )}
      </Center>
    </ModalBody>
  );
}

export default BackjoonModal;
