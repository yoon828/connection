import { Box, Button, Center, Flex, Text } from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import { v4 } from "uuid";

const datas = [
  { id: 1, name: "스터디명", rank: 1 },
  { id: 2, name: "스터디명", rank: 2 },
  { id: 3, name: "스터디명", rank: 3 },
  { id: 4, name: "스터디명", rank: 4 },
  { id: 5, name: "스터디명", rank: 5 },
  { id: 6, name: "스터디명", rank: 6 },
  { id: 7, name: "스터디명", rank: 7 },
  { id: 8, name: "스터디명", rank: 8 },
  { id: 9, name: "스터디명", rank: 9 },
  { id: 10, name: "스터디명", rank: 10 }
];
function Ranking() {
  const [id, setId] = useState(5);
  const ref = useRef();

  return (
    <Center h="100%" w="100%" overflowY="auto" flexDir="column">
      {datas.map(data => {
        return (
          <Flex
            key={v4()}
            bg={id === data.id ? "gra" : "white"}
            borderRadius="15px"
            boxShadow="md"
            p="8px 16px"
            m="3px 0"
            w="200px"
          >
            <Text w="40px">{data.rank}</Text>
            <Text>{data.name}</Text>
          </Flex>
        );
      })}
    </Center>
  );
}

export default Ranking;
