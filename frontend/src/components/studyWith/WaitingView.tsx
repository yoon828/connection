import { Center, Progress, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { UserProfileType } from "../../asset/data/socket.type";
import ParticipantContainer from "./ParticipantContainer";

interface WaitingViewProps {
  participants: UserProfileType[];
}

function WaitingView({ participants }: WaitingViewProps) {
  const [isBossIn, setIsBossIn] = useState(false);

  useEffect(() => {
    let existBoss = false;
    participants.forEach(user => {
      if (user.studyRole === "LEADER") {
        existBoss = true;
      }
    });
    setIsBossIn(existBoss);
  }, [participants]);

  return (
    <Center flexDirection="column">
      {isBossIn ? (
        <>
          <Text fontSize="48px" fontWeight="700" m="240px 0 32px 0">
            문제 설정 중입니다.
          </Text>
          <ParticipantContainer users={participants} />
          <Text mb="60px" fontSize="20px">
            스터디장이 문제를 설정하고 있습니다. 대기해주세요.
          </Text>
          <Progress w="720px" h="24px" borderRadius="16px" isIndeterminate />
        </>
      ) : (
        <>
          <Text fontSize="48px" fontWeight="700" m="240px 0 32px 0">
            스터디장이 아직 입장하지 않았어요!
          </Text>
          <ParticipantContainer users={participants} />
          <Text mb="60px" fontSize="20px">
            스터디장이 입장할때까지 잠시 기다려주세요..
          </Text>
        </>
      )}
    </Center>
  );
}

export default WaitingView;
