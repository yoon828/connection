import {
  Center,
  Flex,
  Highlight,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Text
} from "@chakra-ui/react";
import React, { useState } from "react";

type TimeProblemContainerProps = {
  id: number;
  title: string;
  recommendTime: number;
  setTimes: (id: string, time: number) => void;
};

function TimeProblemContainer({
  id,
  title,
  recommendTime,
  setTimes
}: TimeProblemContainerProps) {
  const format = (val: number) => `${val}분`;
  const parse = (val: string) => +val.replace("분", "");
  const [time, setTime] = useState(recommendTime);

  return (
    <Center mb="32px">
      <Flex
        alignItems="center"
        bg="dep_1"
        w="440px"
        h="72px"
        borderRadius="16px"
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
      >
        <Center borderRight="1px solid #b8b8b8" w="80px" h="40px">
          <Text p="16px">{id}</Text>
        </Center>
        <Text ml="16px">{title}</Text>
      </Flex>
      <NumberInput
        min={1}
        max={180}
        value={format(time)}
        onChange={value => {
          setTime(parse(value));
          setTimes(`${id}`, parse(value));
        }}
        borderColor="dep_1"
        ml="32px"
        bg="dep_1"
        w="100px"
        h="72px"
        borderRadius="20px"
        shadow="2px 4px 4px rgba(0, 0, 0, 0.25)"
      >
        <NumberInputField h="72px" />
        <NumberInputStepper>
          <NumberIncrementStepper _hover={{ background: "gra" }} />
          <NumberDecrementStepper _hover={{ background: "gra" }} />
        </NumberInputStepper>
      </NumberInput>
      <Text ml="12px">
        <Highlight
          query={`${recommendTime}분 추천`}
          styles={{
            px: "4",
            py: "1",
            rounded: "full",
            fontWeight: 500,
            bg: "gra",
            color: "chakra-body-text"
          }}
        >
          {`${recommendTime}분 추천`}
        </Highlight>
      </Text>
    </Center>
  );
}

export default React.memo(TimeProblemContainer);
