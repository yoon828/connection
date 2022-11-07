import { Center, CircularProgress } from "@chakra-ui/react";
import React, { ChangeEvent, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import NumberSetView from "../components/studyWith/NumberSet/NumberSetView";
import ProblemSetView from "../components/studyWith/ProblemSet/ProblemSetView";
import ResultView from "../components/studyWith/Result/ResultView";
import ReviewView from "../components/studyWith/Review/ReviewView";
import SolvingView from "../components/studyWith/Solving/SolvingView";
import TimeSetView from "../components/studyWith/TimeSet/TimeSetView";
import {
  ClientToServerEvents,
  PageViewState,
  ServerToClientEvents,
  UserProfileType
} from "../asset/data/socket.type";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { reset } from "../store/ducks/selectedProblem/selectedProblemSlice";

function StudyWith() {
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(
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
        })
  );

  const { studyId, name, imageUrl } = useAppSelector(
    ({ auth: { information } }) => information
  );

  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isBoss, setIsBoss] = useState(false);
  const [participants, setPartcipants] = useState<UserProfileType[]>([]);
  const navigate = useNavigate();

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
      socket={socket}
    />,
    <SolvingView
      key={PageViewState.Solving}
      onBtnClick={() => setStep(PageViewState.Result)}
      socket={socket}
    />,
    <ResultView
      key={PageViewState.Result}
      onBtnClick={() => setStep(PageViewState.Review)}
      socket={socket}
    />,
    <ReviewView
      key={PageViewState.Review}
      socket={socket}
      onBtnClick={() => navigate("/study", { replace: true })}
    />
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

    socket.on("endStudy", () => {
      setStep(PageViewState.Result);
    });

    socket.on("startSolve", () => {
      setStep(PageViewState.Solving);
    });
    return () => {
      dispatch(reset());
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
