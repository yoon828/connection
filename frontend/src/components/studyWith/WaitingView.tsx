import { Center, Progress, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { UserProfileType } from "../../asset/data/socket.type";
import ParticipantContainer from "./ParticipantContainer";
import "./bubble.css";
import popSound from "../../asset/sound/bubble.mp3";

interface WaitingViewProps {
  participants: UserProfileType[];
}

function WaitingView({ participants }: WaitingViewProps) {
  const [isBossIn, setIsBossIn] = useState(false);
  const bubbleRate = 250;
  const addBubble = () => {
    const bm = document.querySelector("#bubble_machine") as HTMLDivElement;
    const b = document.createElement("div");
    b.className = "bubble";
    b.style.width = `${Math.random() * 100 + 28}px`;
    b.style.left = `${Math.random() * 100}%`;
    b.style.animationDuration = `${Math.floor(Math.random() * 10) + 8}s`;
    b.onclick = (ev: MouseEvent) => {
      const bubbleEle = ev.currentTarget as HTMLDivElement;
      bubbleEle.classList.add("pop_bubble");
      const pop = new Audio(popSound);
      pop.play();
    };

    b.onanimationend = (ev: Event) => {
      const bubbleEle = ev.currentTarget as HTMLDivElement;
      bubbleEle.remove();
    };

    bm.appendChild(b);

    setTimeout(addBubble, bubbleRate);
  };

  useEffect(() => {
    addBubble();
  }, []);

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
    <Center flexDirection="column" m="240px 0 32px 0">
      {isBossIn ? (
        <Center flexDir="column" zIndex={3}>
          <Text fontSize="48px" fontWeight="700">
            문제 설정 중입니다.
          </Text>
          <ParticipantContainer users={participants} />
          <Text mb="60px" fontSize="20px">
            스터디장이 문제를 설정하고 있습니다. 대기해주세요.
          </Text>
          <Progress w="720px" h="24px" borderRadius="16px" isIndeterminate />
        </Center>
      ) : (
        <Center flexDir="column" zIndex={3}>
          <Text fontSize="48px" fontWeight="700" zIndex="3">
            스터디장이 아직 입장하지 않았어요!
          </Text>
          <ParticipantContainer users={participants} />
          <Text mb="60px" fontSize="20px">
            스터디장이 입장할때까지 잠시 기다려주세요..
          </Text>
        </Center>
      )}
      <div id="bubble_machine" />
    </Center>
  );
}

export default WaitingView;
