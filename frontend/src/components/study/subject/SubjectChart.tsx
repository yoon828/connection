import React, { useEffect, useState } from "react";
import { Alert, AlertIcon, Badge, Box, Center, Text } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type ChartProps = {
  series: number[];
  labels: string[];
};

function HomeworkChart({ series, labels }: ChartProps) {
  // series = [1];
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
    series.map(cnt => (!flag && cnt > 0 ? setFlag(true) : setFlag(false)));
  }, []);

  return (
    <Center flexDir="column" p="0 10px">
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

export default HomeworkChart;
