import React, { useEffect, useState } from "react";
import HeatMap from "@uiw/react-heat-map";
import Tooltip from "@uiw/react-tooltip";
import { useColorMode } from "@chakra-ui/react";
import { getStrict } from "../../api/study";

function Challenge() {
  const { colorMode } = useColorMode();
  const [strict, setstrict] = useState([]);
  const [selected, setSelected] = useState("");

  const getChallenge = async () => {
    const data = await getStrict();
    // console.log(data);
  };
  const value = [
    { date: "2016/01/11", count: 2 },
    { date: "2016/01/12", count: 4 },
    { date: "2016/01/13", count: 2 },
    ...[...Array(17)].map((_, idx) => ({
      date: `2016/02/${idx + 10}`,
      count: idx,
      content: ""
    })),
    { date: "2016/04/11", count: 2 },
    { date: "2016/05/01", count: 5 },
    { date: "2016/05/02", count: 5 },
    { date: "2016/05/04", count: 3 }
  ];

  useEffect(() => {
    getChallenge();
  }, []);

  return (
    <HeatMap
      value={value}
      width={400}
      style={{ color: colorMode === "light" ? "black" : "white" }}
      startDate={new Date("2016/01/01")}
      legendCellSize="0"
      panelColors={{
        0: colorMode === "light" ? "#C5C8CD" : "rgb(255 255 255 / 25%)",
        2: "#CFE5FE",
        4: "#A3CDFF",
        6: "#4299FF"
      }}
      rectProps={{
        rx: "3px"
      }}
      rectSize={14}
      // eslint-disable-next-line react/no-unstable-nested-components
      rectRender={(props, data) => {
        if (selected !== "") {
          props.opacity = data.date === selected ? 1 : 0.45;
        }
        return (
          <Tooltip
            key={`${data.date}_${data.row}`}
            placement="top"
            content={`count: ${data.count || 0}`}
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
