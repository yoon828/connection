import { useColorMode, Center, Box, Text } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import React, { useEffect, useRef, useState } from "react";
import ReactApexChart from "react-apexcharts";
import { ContentProps } from "./MyActivity";

type PercentChartProps = {
  title: string;
  content: ContentProps;
};
function PercentChart({ title, content }: PercentChartProps) {
  const { colorMode } = useColorMode();
  const [series, setSeries] = useState<number[]>([]);

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

  useEffect(() => {
    if (content) {
      setSeries(
        content.total !== 0
          ? [Math.floor((content.my / content.total) * 100)]
          : [0]
      );
    }
  }, [content]);

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

export default PercentChart;
