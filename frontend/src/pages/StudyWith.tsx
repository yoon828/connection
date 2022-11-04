import { Center, CircularProgress } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import NumberSetView from "../components/studyWith/NumberSetView";
import ProblemSetView from "../components/studyWith/ProblemSetView";
import ResultView from "../components/studyWith/ResultView";
import ReviewView from "../components/studyWith/ReviewView";
import SolvingView from "../components/studyWith/SolvingView";
import TimeSetView from "../components/studyWith/TimeSetView";
import {
  ClientToServerEvents,
  PageViewState,
  ServerToClientEvents,
  UserProfileType
} from "../asset/data/socket.type";
import { useAppSelector } from "../store/hooks";

function StudyWith() {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    process.env.NODE_ENV === "development"
      ? io("ws://localhost:8000", {
          autoConnect: false,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 3,
          transports: ["websocket"]
        })
      : io("wss://k7c202.p.ssafy.io", {
          path: "/node/socket.io",
          autoConnect: false,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 3,
          transports: ["websocket"]
        });
  const { studyId, name, imageUrl } = useAppSelector(
    ({ auth: { information } }) => information
  );

  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBoss, setIsBoss] = useState(false);
  const [participants, setPartcipants] = useState<UserProfileType[]>([]);

  const bossView: React.FunctionComponentElement<undefined>[] = [
    <NumberSetView
      key={PageViewState.NumberSet}
      onBtnClick={() => setStep(PageViewState.ProblemSet)}
    />,
    <ProblemSetView
      key={PageViewState.ProblemSet}
      onBtnClick={() => setStep(PageViewState.TimeSet)}
      participants={participants}
    />,
    <TimeSetView
      key={PageViewState.TimeSet}
      onBtnClick={() => setStep(PageViewState.Solving)}
      onPrevBtnClick={() => setStep(PageViewState.ProblemSet)}
      participants={participants}
    />,
    <SolvingView
      key={PageViewState.Solving}
      onBtnClick={() => setStep(PageViewState.Result)}
    />,
    <ResultView
      key={PageViewState.Result}
      onBtnClick={() => setStep(PageViewState.Review)}
    />,
    <ReviewView key={PageViewState.Review} onBtnClick={() => setStep(1)} />
  ];

  useEffect(() => {
    socket.connect();
    socket.emit(
      "enter",
      studyId,
      name,
      imageUrl,
      (userList: UserProfileType[]) => setPartcipants(userList)
    );

    socket.on("addParticipant", (newName, newImageUrl) => {
      setPartcipants(prev => [
        ...prev,
        { name: newName, imageUrl: newImageUrl }
      ]);
    });

    socket.on("removeParticipant", targetName => {
      setPartcipants(prev => prev.filter(user => user.name !== targetName));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Center>
      {isLoading ? (
        <CircularProgress size="120px" mt="30vh" isIndeterminate color="main" />
      ) : (
        <Center>
          {bossView.map((view, ind) => {
            return ind === step && view;
          })}
        </Center>
      )}
    </Center>
  );
}

export default StudyWith;
