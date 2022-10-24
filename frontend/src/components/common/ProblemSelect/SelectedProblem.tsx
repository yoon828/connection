import { Flex, Icon, Text } from "@chakra-ui/react";
import React from "react";
import { HiMinusCircle } from "react-icons/hi";

export interface SelectedProblem {
  no: number;
  title: string;
}

interface SelectedProblemProps extends SelectedProblem {
  onDeleteHandler: () => void;
}

function SelectedProblem({ no, title, onDeleteHandler }: SelectedProblemProps) {
  return (
    <Flex
      key={no}
      p={4}
      bg="dep_3"
      w="full"
      borderRadius="20px"
      alignItems="center"
      justifyContent="space-around"
    >
      <Text w="15%" borderRight="1px" borderColor="border_gray">
        No {no}
      </Text>
      <Text w="70%" paddingLeft={1}>
        {title}
      </Text>
      <Icon
        w="15%"
        as={HiMinusCircle}
        fill="red"
        cursor="pointer"
        onClick={onDeleteHandler}
      />
    </Flex>
  );
}

export default SelectedProblem;
