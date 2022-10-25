import React from "react";
import {
  Box,
  Button,
  Center,
  Image,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { v4 } from "uuid";
import LogoLight from "../asset/img/logo_light.png";
import LogoDark from "../asset/img/logo_dark.png";
import C from "../asset/img/c.png";
import Java from "../asset/img/java.png";
import JS from "../asset/img/js.png";
import Python from "../asset/img/python.png";
import Kotlin from "../asset/img/kotlin.png";
import Rank from "../asset/img/rank.png";
import Homework from "../asset/img/homework.png";
import MainBox from "../components/common/MainBox";
import { studyInfos, etcInfos } from "../asset/data/main";
import MainSquare from "../components/common/MainSquare";

function Main() {
  const { colorMode } = useColorMode();

  const imgs = [C, Java, JS, Python, Kotlin];

  const squares = [
    {
      src: Rank,
      title: "스터디 랭킹",
      content:
        "챌린지, 문제풀이, 과제 등을 기반으로 선정된 점수로 랭킹을 보여줘요"
    },
    {
      src: Homework,
      title: "스터디 과제",
      content: "지정한 기간안에 정해진 문제들을 스터디원들과 같이 풀어보세요"
    }
  ];

  return (
    <Box>
      <Center as="section" flexDir="column" py="50px">
        <Center flexDir="column" my="50px">
          <Center fontSize="32px" fontWeight="bold" flexDir="column" my="50px">
            스터디원들과 함께
            <Text>
              <Text as="span" color="main">
                코
              </Text>
              딩 &nbsp;
              <Text as="span" color="main">
                알
              </Text>
              고리즘&nbsp;
              <Text as="span" color="main">
                라
              </Text>
              이브
            </Text>
          </Center>
          <Image
            src={colorMode === "light" ? LogoLight : LogoDark}
            alt="logo"
            w="300px"
            mb="40px"
          />
          <Button bg="gra" width="200px" mb="60px">
            시작하기
          </Button>
        </Center>
        <Center maxW="800px">
          {imgs.map(img => {
            return (
              <Image src={img} alt="language" key={v4()} w="80px" mx="20px" />
            );
          })}
        </Center>
      </Center>
      <Box as="section" bg="#fbfbfb" _dark={{ bg: "#1b1b1b" }} py="50px">
        <Center maxW="800px" m="0 auto" flexDir="column">
          <Box w="100%">
            <Box
              bg="gra"
              w="500px"
              h="200px"
              borderRadius="15px"
              p="10px 30px"
              fontSize="24px"
              fontWeight="bold"
              display="flex"
              flexDir="column"
              justifyContent="center"
            >
              <Text color="main" fontSize="16px">
                스터디
              </Text>
              혼자서 외로운 <br />
              알고리즘 공부, 이제 그만 ✋ <br />
              같이하면 즐거움이 두 배
            </Box>
          </Box>
          {studyInfos.slice(0, 3).map((info, idx) => {
            return (
              <MainBox
                dir={idx % 2 === 0 ? "right" : "left"}
                data={info}
                key={v4()}
              />
            );
          })}
          <Center w="100%" justifyContent="space-around">
            {squares.map(square => {
              return <MainSquare data={square} key={v4()} />;
            })}
          </Center>
          {studyInfos.slice(3).map((info, idx) => {
            return (
              <MainBox
                dir={idx % 2 === 0 ? "right" : "left"}
                data={info}
                key={v4()}
              />
            );
          })}
        </Center>
      </Box>
      <Box as="section" py="50px">
        <Center maxW="800px" m="0 auto" flexDir="column">
          <Box w="100%">
            <Box
              bg="gra"
              w="500px"
              h="200px"
              borderRadius="15px"
              p="10px 30px"
              fontSize="24px"
              fontWeight="bold"
              display="flex"
              flexDir="column"
              justifyContent="center"
            >
              <Text color="main" fontSize="16px">
                문제관리
              </Text>
              취준생을 위한 문제 선택,
              <br />
              Github 업로드 <br />
              이제는 간편하게
            </Box>
          </Box>
          {etcInfos.map((info, idx) => {
            return (
              <MainBox
                dir={idx % 2 === 0 ? "right" : "left"}
                data={info}
                key={v4()}
              />
            );
          })}
        </Center>
      </Box>
      <Center
        as="section"
        py="50px"
        h="250px"
        bg={
          colorMode === "light"
            ? "linear-gradient(180deg, #FFFFFF 0%, #88BFFF 100%)"
            : "linear-gradient(180deg, #121212 0%, #1581FF 100%)"
        }
      >
        <Center
          maxW="800px"
          m="0 auto"
          flexDir="column"
          h="100%"
          justifyContent="space-evenly"
        >
          <Text>
            더 이상 혼자가 아닌 스터디원들과 같이 알고리즘 문제를 푸세요
          </Text>
          <Text display="flex">
            <Image
              src={colorMode === "light" ? LogoLight : LogoDark}
              alt="logo"
              w="130px"
              mx="10px"
            />
            와 함께라면 더 높은 곳 까지 갈 수 있어요
          </Text>
        </Center>
      </Center>
      <Box as="footer" h="300px" display="flex">
        <Box maxW="800px" w="100%" m="0 auto">
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            alignItems="flex-end"
            mr="20px"
            h="100%"
          >
            <Text>Coalla by 우건이와 아이들</Text>
            <Text color="dep_3" mb="60px">
              김우건 김윤민 김준우 염진호 이기영 최진합
            </Text>
            <Text color="dep_3" mb="30px">
              © 2022 Coalla All Rights Reserved
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Main;
