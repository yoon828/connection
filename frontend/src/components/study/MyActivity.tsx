import React, { useState, useEffect } from "react";
import { Box, Center, Text, useColorMode } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { getMyActivity } from "../../api/study";

type ContentProps = {
  my: number;
  total: number;
};

type PercentChartProps = {
  title: string;
  content: ContentProps | null;
};

const init: ContentProps = {
  my: 0,
  total: 0
};

function PercentChart({ title, content }: PercentChartProps) {
  const { colorMode } = useColorMode();
  const options: ApexOptions = {
    chart: {
      height: 100,
      type: "radialBar"
    },
    colors: ["#88BFFF"],
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "65%"
        },
        track: {
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.15
          }
        },
        dataLabels: {
          name: {
            offsetY: -10,
            color: "#1581FF",
            fontSize: "20px"
          },
          value: {
            color: colorMode === "light" ? "#000" : "#fff",
            fontSize: "30px",
            show: true
          }
        }
      }
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#1581FF"],
        stops: [0, 100]
      }
    },
    stroke: {
      lineCap: "round"
    },
    labels: ["풀이율"]
  };
  if (content) {
    const series =
      content.total !== 0 ? [(content.my / content.total) * 100] : [0];
    return (
      <Center>
        <ReactApexChart
          series={series}
          type="radialBar"
          height={220}
          width={220}
          options={options}
        />
        <Box flexDir="column" mr="20px">
          <Text>
            총 {title} 수 : {content.total}
          </Text>
          <Text>
            내가 푼 {title} 수 :{content.my}
          </Text>
        </Box>
      </Center>
    );
  }
  return null;
}

function MyActivity() {
  const [subject, setSubject] = useState<ContentProps>(init); // 과제
  const [problems, setProblems] = useState<ContentProps>(init); // 스터디 전체 문제

  const getMyActivityApi = async () => {
    const {
      data: {
        data: {
          solvedSubject,
          totalSubject,
          solvedStudyProblem,
          totalStudyProblem
        }
      }
    } = await getMyActivity();
    // console.log(totalSubject);
    // console.log(totalStudyProblem);
    setSubject({ my: solvedSubject, total: totalSubject });
    setProblems({ my: solvedStudyProblem, total: totalStudyProblem });
  };

  useEffect(() => {
    getMyActivityApi();
  }, []);

  return (
    <Center w="100%">
      <PercentChart title="과제" content={subject} />
      <PercentChart title="문제" content={problems} />
    </Center>
  );
}

export default MyActivity;
