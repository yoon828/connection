import React, { useEffect } from "react";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import { Center } from "@chakra-ui/react";

function NumberComponent({ accomplished, index }) {
  return (
    <Center
      className={`indexedStep ${accomplished ? "accomplished" : null}`}
      w="30px"
      h="30px"
      bg="gra"
      borderRadius="50px"
      fontSize={12}
      filter={`grayscale(${accomplished ? 0 : 80}%)`}
    >
      {index + 1}
    </Center>
  );
}

function JoinStep({ percent }) {
  return (
    <ProgressBar
      percent={percent}
      filledBackground="linear-gradient(180deg, #88BFFF, #1581FF)"
    >
      <Step>
        {({ accomplished, index }) => (
          <NumberComponent accomplished={accomplished} index={index} />
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <NumberComponent accomplished={accomplished} index={index} />
        )}
      </Step>
      <Step>
        {({ accomplished, index }) => (
          <NumberComponent accomplished={accomplished} index={index} />
        )}
      </Step>
    </ProgressBar>
  );
}

export default JoinStep;
