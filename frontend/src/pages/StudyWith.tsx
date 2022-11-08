import { Center, CircularProgress, Text } from "@chakra-ui/react";
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
  ServerProblemType,
  ServerToClientEvents,
  UserProfileType
} from "../asset/data/socket.type";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { reset } from "../store/ducks/selectedProblem/selectedProblemSlice";
import WaitingView from "../components/studyWith/WaitingView";

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

  const { studyId, name, imageUrl, backjoonId, studyRole } = useAppSelector(
    ({ auth: { information } }) => information
  );

  const dispatch = useAppDispatch();
  const [step, setStep] = useState(PageViewState.Waiting);
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setPartcipants] = useState<UserProfileType[]>([]);
  const [solvingProblmes, setSolvingProblems] = useState<ServerProblemType[]>(
    []
  );
  const navigate = useNavigate();

  const bossView: React.FunctionComponentElement<undefined>[] = [
    // <NumberSetView
    //   key={PageViewState.NumberSet}
    //   onBtnClick={() => setStep(PageViewState.ProblemSet)}
    // />,
    <WaitingView participants={participants} key={PageViewState.Waiting} />,
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
      solvingProblmes={solvingProblmes}
      setSolvingProblems={(problems: ServerProblemType[]) =>
        setSolvingProblems(problems)
      }
    />,
    <ResultView
      key={PageViewState.Result}
      onBtnClick={() => setStep(PageViewState.Review)}
      socket={socket}
    />,
    <ReviewView
      key={PageViewState.Review}
      solvingProblmes={solvingProblmes}
      onBtnClick={() => navigate("/study", { replace: true })}
    />
  ];

  useEffect(() => {
    socket.connect();
    socket.emit(
      "enter",
      `${studyId}`,
      name,
      imageUrl,
      backjoonId as string,
      studyRole as "MEMBER" | "LEADER",
      (userList: UserProfileType[], isStudying: boolean) => {
        setPartcipants(userList);
        if (isStudying) {
          setStep(PageViewState.Solving);
        } else if (studyRole === "MEMBER") {
          setStep(PageViewState.Waiting);
        } else {
          setStep(PageViewState.ProblemSet);
        }
        setIsLoading(true);
      }
    );

    socket.on("addParticipant", (newName, newImageUrl, newStudyRole) => {
      setPartcipants(prev => [
        ...prev,
        { name: newName, imageUrl: newImageUrl, studyRole: newStudyRole }
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
      {!isLoading ? (
        <Center flexDir="column">
          <CircularProgress
            size="120px"
            mt="30vh"
            isIndeterminate
            color="main"
          />
          <Text fontSize="36px" mt="40px">
            서버와 연결중입니다.. 잠시만 기다려주세요
          </Text>
        </Center>
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
