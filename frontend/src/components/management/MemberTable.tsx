import React from "react";
import { Box, Flex, Grid, Image, Text } from "@chakra-ui/react";
import ReactApexChart from "react-apexcharts";

import useChartOption from "../../hooks/useChartOption";
import { MemberType } from "../../pages/study/Management";
import { useAppSelector } from "../../store/hooks";

interface MemberTableProps {
  members: MemberType[];
  onBanBtnClick: (name: string, id: number) => void;
  isBoss: boolean;
}

function MemberTable({ members, onBanBtnClick, isBoss }: MemberTableProps) {
  const auth = useAppSelector(state => state.auth);
  const chartOption = useChartOption();
  return (
    <Grid templateColumns="repeat(2,1fr)" gap="32px">
      {members.map(member => (
        <Box
          bg="dep_1"
          key={member.userId}
          borderRadius="20px"
          shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
        >
          <Flex bg="dep_2" p={2} textAlign="center" borderTopRadius="20px">
            <Image
              src={member.imageUrl}
              alt={member.name}
              width="24px"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src =
                  "https://avatars.githubusercontent.com/u/48246705?s=40&v=4";
              }}
              borderRadius="50%"
            />
            <Text flexGrow={3}>{member.name}</Text>
            {isBoss && member.userId !== auth.information.userId && (
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
          {member.series.length === 0 ? (
            <Flex
              w="100%"
              h="235px"
              justifyContent="center"
              alignItems="center"
            >
              <Text>데이터가 없습니다.</Text>
            </Flex>
          ) : (
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
          )}
        </Box>
      ))}
    </Grid>
  );
}

export default MemberTable;
