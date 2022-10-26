import { Highlight, Text } from "@chakra-ui/react";
import React from "react";

interface ViewTitleProps {
  main: string;
  mt: number;
  mb: number;
  des: string | null;
  highLight: string;
  desSize?: number;
}

function ViewTitle({ main, mt, mb, des, highLight, desSize }: ViewTitleProps) {
  return (
    <>
      <Text fontSize="48px" fontWeight="700" mt={`${mt}px`} mb="20px">
        {main}
      </Text>
      {des && (
        <Text mb={`${mb}px`} fontSize={`${desSize}px`}>
          <Highlight
            query={highLight}
            styles={{
              px: "4",
              py: "1",
              rounded: "full",
              fontWeight: 600,
              bg: "gra",
              color: "chakra-body-text"
            }}
          >
            {des}
          </Highlight>
        </Text>
      )}
    </>
  );
}

ViewTitle.defaultProps = {
  desSize: 16
};

export default ViewTitle;
