import React, { useState } from "react";
import { Badge, Box, Center, Text } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

type ChartProps = {
  series: number[];
  labels: string[];
};

function HomeworkChart({ series, labels }: ChartProps) {
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
  return (
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
  );
}

export default HomeworkChart;
