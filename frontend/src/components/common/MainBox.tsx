import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { v4 } from "uuid";
import { BoxDataProp } from "../../asset/data/main";

interface MainBoxProps {
  dir: string;
  data: BoxDataProp;
}

function MainBox({ dir, data }: MainBoxProps) {
  return (
    <Flex
      my="100px"
      w="100%"
      flexDir={dir === "right" ? "row" : "row-reverse"}
      data-aos={dir === "right" ? "fade-right" : "fade-left"}
    >
      <Box w="50%">
        <Box
          boxShadow="md"
          borderRadius="15px"
          w="380px"
          position="relative"
          overflow="hidden"
        >
          <video autoPlay loop muted playsInline>
            <source
              src={`/asset/img/main/${data.img}.webm`}
              type="video/webm"
            />
            <source src={`/asset/img/main/${data.img}.mp4`} type="video/mp4" />
          </video>
        </Box>
        {/* <Image
          src={data.img ? data.img : TMP}
          alt="info_img"
          w="380px"
          boxShadow="md"
          borderRadius="15px"
        /> */}
      </Box>
      <Box
        w="50%"
        display="flex"
        flexDir="column"
        justifyContent="space-evenly"
      >
        <Text color="main" fontSize="16px" fontWeight="bold">
          {data.category}
        </Text>
        <Box>
          {data.title.map(line => {
            return (
              <Text fontSize="24px" fontWeight="bold" key={v4()}>
                {line}
              </Text>
            );
          })}
        </Box>
        <Box>
          {data.content.map(line => {
            return (
              <Text fontSize="14px" key={v4()}>
                {line}
              </Text>
            );
          })}
        </Box>
      </Box>
    </Flex>
  );
}

export default MainBox;
