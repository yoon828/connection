/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import Tooltip from "@uiw/react-tooltip";
import { useColorMode } from "@chakra-ui/react";
import { getStrict } from "../../api/study";

function Challenge() {
  const { colorMode } = useColorMode();
  const [selected, setSelected] = useState("");
  const [streak, setStreak] = useState([]);
  const [info, setInfo] = useState();

  const getChallenge = async () => {
    const {
      data: { data, startDate, endDate, studyPersonnel }
    } = await getStrict();
    setInfo({
      startDate,
      endDate,
      studyPersonnel
    });
    const tmp = [];
    data.map(day => {
      // const percent = (day.count / data.studyPersonnel) * 100;
      const percent = Math.ceil((2 / 3) * 100);
      console.log(percent);
      return tmp.push({ ...day, count: percent, cnt: day.count }); // count에는 퍼센트 cnt에 해당 날짜에 몇 명이 제출했는지
    });
    setStreak(tmp);
  };

  const value = [
    { date: "2022/10/11", count: 2 },
    { date: "2022/10/12", count: 4 },
    { date: "2022/10/13", count: 2 },
    ...[...Array(17)].map((_, idx) => ({
      date: `2022/10/${idx + 10}`,
      count: idx,
      content: ""
    })),
    { date: "2022/10/11", count: 2 },
    { date: "2022/10/01", count: 5 },
    { date: "2022/10/02", count: 5 },
    { date: "2022/10/04", count: 3, cnt: 1 }
  ];

  useEffect(() => {
    getChallenge();
  }, []);

  return (
    <HeatMap
      value={value}
      width={400}
      height={170}
      style={{ color: colorMode === "light" ? "black" : "white" }}
      startDate={new Date(info?.startDate)}
      endDate={new Date(info?.endDate)}
      legendCellSize={12}
      panelColors={{
        0: colorMode === "light" ? "#C5C8CD" : "rgb(255 255 255 / 25%)",
        2: "#CFE5FE",
        4: "#A3CDFF",
        6: "#4299FF"
      }}
      rectProps={{
        rx: "3px"
      }}
      rectSize={13}
      rectRender={(props, data) => {
        if (selected !== "") {
          props.opacity = data.date === selected ? 1 : 0.45;
        }
        return (
          <Tooltip
            key={`${data.date}_${data.row}`}
            placement="top"
            content={`${data.cnt || 0} problems solved on ${data.date}`}
          >
            <rect
              {...props}
              onClick={() => {
                setSelected(data.date === selected ? "" : data.date);
              }}
            />
          </Tooltip>
        );
      }}
    />
  );
}
export default Challenge;
