import React from "react";
import { Flex, Icon, Text } from "@chakra-ui/react";
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
      bg="dep_2"
      w="full"
      borderRadius="20px"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text>{no}</Text>
      <Text paddingLeft={2} noOfLines={2}>
        {title}
      </Text>
      <Icon
        w="24px"
        h="24px"
        as={HiMinusCircle}
        fill="custom_red"
        cursor="pointer"
        onClick={onDeleteHandler}
      />
    </Flex>
  );
}

export default SelectedProblem;
