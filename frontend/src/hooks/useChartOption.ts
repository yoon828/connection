import { useColorMode } from "@chakra-ui/react";
import { ApexOptions } from "apexcharts";
import { useMemo } from "react";

function useChartOption() {
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
        },
        background: "transparent"
      },
      colors: ["#88BFFF", "#88bbBf"],
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
        show: false,
        labels: {
          style: {
            colors: [`${colorMode === "light" ? "#000" : "#fff"}`]
          }
        }
      },
      legend: {
        show: true,
        showForSingleSeries: true,
        customLegendItems: ["푼 문제", "푼 과제", "스터디 평균"],
        markers: {
          fillColors: ["#88BFFF", "#88bbBf", "#775DD0"]
        },
        labels: {
          colors: [`${colorMode === "light" ? "#000" : "#fff"}`]
        }
      },
      theme: {
        mode: colorMode === "light" ? "light" : "dark"
      }
    }),
    [colorMode]
  );
  return CHART_OPTIONS;
}

export default useChartOption;
