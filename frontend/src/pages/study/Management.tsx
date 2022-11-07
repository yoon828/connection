import {
  Box,
  Button,
  Flex,
  Grid,
  Text,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useMemo, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { deleteStudy, getMember, quitStudy } from "../../api/study";
import BackButton from "../../components/common/BackButton";
import Confirm from "../../components/common/Confirm";
import StudyLayout from "../../components/layout/StudyLayout";
import { getUserInfo } from "../../store/ducks/auth/authThunk";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

interface StatSeriesType {
  date: string;
  count: number;
  total: number;
  avg: number;
}
interface MemberType {
  userId: number;
  name: string;
  series: StatSeriesType[];
}
interface ConfirmStateType {
  msg: string;
  onConfirmHandler: () => void;
}

function Management() {
  const { colorMode } = useColorMode();
  const CHART_OPTIONS = useMemo(
    (): ApexOptions => ({
      chart: {
        type: "bar",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      colors: ["#88BFFF"],
      plotOptions: {
        bar: {
          columnWidth: "60%"
        }
      },

      dataLabels: {
        enabled: false
      },
      xaxis: {
        labels: {
          style: {
            colors: [`${colorMode === "light" ? "#000" : "#fff"}`]
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: [`${colorMode === "light" ? "#000" : "#fff"}`]
          }
        },
        max: 100
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["참여율", "평균"],
        markers: {
          fillColors: ["#88BFFF", "#775DD0"]
        },
        labels: {
          colors: [`${colorMode === "light" ? "#000" : "#fff"}`]
        }
      },
      theme: { mode: colorMode === "light" ? "light" : "dark" }
    }),
    [colorMode]
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [confirmState, setConfirmState] = useState<ConfirmStateType>({
    msg: "",
    onConfirmHandler() {
      return null;
    }
  });
  const [members, setMembers] = useState<MemberType[]>([]);
  const auth = useAppSelector(state => state.auth);
  const isBoss = auth.information?.studyRole === "LEADER";

  const getAndSetMembers = async () => {
    const res = await getMember();
    console.log(res.data);
    setMembers(res.data);
  };
  useEffect(() => {
    getAndSetMembers();
  }, []);
  const onExitBtnClick = () => {
    setConfirmState({
      msg: `정말 ${isBoss ? "해체" : "탈퇴"}하시겠습니까?`,
      async onConfirmHandler() {
        if (isBoss) {
          const res = await deleteStudy();
          console.log(res);
          return;
        }
        const res = await quitStudy();
        console.log(res);
        dispatch(getUserInfo());
        navigate("/");
      }
    });
    onOpen();
  };
  const onBanBtnClick = (name: string, id: number) => {
    setConfirmState({
      msg: `정말 ${name}님을 추방하시겠습니까?`,
      async onConfirmHandler() {
        const res = await quitStudy(id);
        console.log(res);
        getAndSetMembers();
      }
    });
    onOpen();
  };
  return (
    <StudyLayout
      title="스터디 관리"
      description="스터디원들의 활동 내역을 확인할 수 있어요"
      sideComponent={<BackButton />}
    >
      <Box ml="auto" w="fit-content" mb="8">
        <Button
          ml="auto"
          bg="dep_1"
          _hover={{ bg: "dep_1", transform: "scale(1.05)" }}
          _active={{ bg: "dep_1", transform: "scale(1.05)" }}
          onClick={onExitBtnClick}
        >
          {isBoss ? "스터디 해체" : "스터디 탈퇴"}
        </Button>
      </Box>
      <Grid templateColumns="repeat(2,1fr)" gap="32px">
        {members.map((member, idx) => (
          <Box bg="dep_1" key={member.userId}>
            <Flex bg="dep_2" p={2} textAlign="center">
              <Text flexGrow={1} borderRight="1px" borderColor="border_gray">
                No {idx + 1}
              </Text>
              <Text flexGrow={3}>{member.name}</Text>
              {isBoss && (
                <Text
                  flexGrow={1}
                  color="red"
                  cursor="pointer"
                  borderLeft="1px"
                  borderColor="border_gray"
                  onClick={() => {
                    onBanBtnClick(member.name, member.userId);
                  }}
                >
                  추방
                </Text>
              )}
            </Flex>
            <ReactApexChart
              type="bar"
              height={220}
              width="100%"
              options={CHART_OPTIONS}
              series={[
                {
                  name: "참여율",
                  data: [
                    ...member.series.map(data => ({
                      x: data.date.split("-")[1],
                      y: Math.round((100 * data.count) / data.total),
                      goals: [
                        {
                          name: "평균",
                          value: data.avg * 100,
                          strokeColor: "#775DD0"
                        }
                      ]
                    }))
                  ]
                }
              ]}
            />
          </Box>
        ))}
      </Grid>
      <Confirm
        isOpen={isOpen}
        onClose={onClose}
        msg={confirmState.msg}
        onConfirmHandler={confirmState.onConfirmHandler}
      />
    </StudyLayout>
  );
}

export default Management;
