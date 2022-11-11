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
  const [info, setInfo] = useState({});

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
      const percent = Math.floor((day.count / studyPersonnel) * 100);
      return tmp.push({ ...day, count: percent, cnt: day.count }); // count에는 퍼센트 cnt에 해당 날짜에 몇 명이 제출했는지
    });
    setStreak(tmp);
  };

  useEffect(() => {
    getChallenge();
  }, []);

  return (
    <HeatMap
      value={streak}
      width={420}
      height={170}
      style={{ color: colorMode === "light" ? "black" : "white" }}
      startDate={new Date(info?.startDate)}
      endDate={new Date(info?.endDate)}
      legendCellSize={12}
      legendRender={props => {
        return <rect {...props} rx={3} pointerEvents="none" />;
      }}
      monthLabels={[
        "1월",
        "2월",
        "3월",
        "4월",
        "5월",
        "6월",
        "7월",
        "8월",
        "9월",
        "10월",
        "11월",
        "12월"
      ]}
      weekLabels={["일", "월", "화", "수", "목", "금", "토"]}
      panelColors={{
        0: colorMode === "light" ? "#C5C8CD" : "rgb(255 255 255 / 25%)",
        30: "#C3DFFF",
        60: "#A3CDFF",
        80: "#4299FF"
      }}
      rectProps={{
        rx: "3px"
      }}
      rectSize={14}
      rectRender={(props, data) => {
        if (selected !== "") {
          props.opacity = data.date === selected ? 1 : 0.45;
        }
        return (
          <Tooltip
            key={`${data.date}_${data.row}`}
            placement="top"
            content={
              <div>
                {data.date}
                <br />
                {data.cnt
                  ? `스터디원 ${data.cnt}명이 문제를 풀었어요!😊`
                  : "아무도 풀지 않았어요😥"}
              </div>
            }
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
