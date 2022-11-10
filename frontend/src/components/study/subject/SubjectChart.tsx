import React, { useEffect, useState } from "react";
import { Alert, AlertIcon, Badge, Box, Center, Text } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { UserProps } from "./SubjectView";

type SubjectChartProps = {
  users: UserProps[];
  flex: number;
};

function SubjectChart({ users, flex }: SubjectChartProps) {
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setlabels] = useState<string[]>([]);
  const [flag, setFlag] = useState(false);
  const options: ApexOptions = {
    chart: {
      type: "polarArea"
    },
    labels,
    colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0", "#fc00fd"],
    yaxis: {
      show: false
    },
    fill: {
      opacity: 0.8
    },
    plotOptions: {
      polarArea: {
        rings: {
          strokeWidth: 0
        },
        spokes: {
          strokeWidth: 0
        }
      }
    },
    legend: {
      show: false
    },
    tooltip: {
      marker: {
        show: true
      }
    }
  };
  useEffect(() => {
    const seriesTmp: number[] = [];
    const labelsTmp: string[] = [];
    users.map(user => {
      seriesTmp.push(user.problem_cnt);
      return labelsTmp.push(user.user_name);
    });
    seriesTmp.map(cnt => {
      if (!flag && cnt > 0) {
        setFlag(true);
      }
      return null;
    });
    setSeries(seriesTmp);
    setlabels(labelsTmp);
  }, []);

  return (
    <Center flexDir="column" p="0 10px" flex={flex}>
      {flag ? (
        <Center flexDir="column">
          <ReactApexChart
            options={options}
            series={series}
            type="polarArea"
            width={230}
          />
          <Badge fontSize="14px" colorScheme="twitter">
            과제 현황
          </Badge>
        </Center>
      ) : (
        <Alert status="info" ml="20px" w="155px">
          <Text fontSize="14px" textAlign="center">
            과제를 제출한 사람이 아무도 없어요😥
          </Text>
        </Alert>
      )}
    </Center>
  );
}

export default SubjectChart;
