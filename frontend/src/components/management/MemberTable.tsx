import React from "react";
import { Box, Flex, Grid, Text } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";
import useChartOption from "../../hooks/useChartOption";
import { MemberType } from "../../pages/study/Management";

interface MemberTableProps {
  members: MemberType[];
  onBanBtnClick: (name: string, id: number) => void;
  isBoss: boolean;
}

function MemberTable({ members, onBanBtnClick, isBoss }: MemberTableProps) {
  const chartOption = useChartOption();
  return (
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
            options={chartOption}
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
                        value: (100 * data.avg) / data.total,
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
  );
}

export default MemberTable;
