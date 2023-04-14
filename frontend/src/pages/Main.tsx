import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { v4 } from "uuid";
import AOS from "aos";
import "aos/dist/aos.css";
import ImgLoad from "components/common/ImgLoad";
import MainBox from "../components/common/MainBox";
import { studyInfos, etcInfos, squares } from "../asset/data/main";
import MainSquare from "../components/common/MainSquare";
import LogoLight from "../asset/img/logo_light.svg";
import LogoDark from "../asset/img/logo_dark.svg";
import DownArrow from "../asset/img/downarrow.gif";

function Main() {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const mainRef = useRef<HTMLDivElement>(null);
  const imgs = ["c", "java", "js", "python", "kotlin"].map(item => (
    <ImgLoad name={item} key={item} />
  ));

  useEffect(() => {
    AOS.init();
  }, []);

  function onDown() {
    mainRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <Box position="relative" minW="800px">
      <Center
        as="section"
        flexDir="column"
        position="relative"
        h="calc(100vh - 68px)"
        justifyContent="space-between"
        minH="550px"
        py="30px"
      >
        <Flex h="60%">
          <Center flexDir="column" alignItems="">
            <Box fontSize="32px" fontWeight="bold" flexDir="column" my="50px">
              <Text>
                <Text as="span" color="main">
                  Co
                </Text>
                de로 스터디원과
                <br /> Co
                <Text as="span" color="main">
                  nnection
                </Text>
                할 수 있는
              </Text>
            </Box>
            <Image
              src={colorMode === "light" ? LogoLight : LogoDark}
              alt="logo"
              w="300px"
              mb="40px"
            />
            <Button
              bg="gra"
              width="200px"
              minH="40px"
              _hover={{}}
              _active={{}}
              onClick={() => navigate("/recommend")}
            >
              시작하기
            </Button>
          </Center>
          <Flex alignItems="center">
            <Box w="430px">
              <ImgLoad name="main_img" />
            </Box>
          </Flex>
        </Flex>
        <Center flexDir="column">
          <Center mb="10px">
            {imgs.map((img, idx) => {
              return (
                <Box
                  data-aos="flip-left"
                  data-aos-delay={idx * 300}
                  data-aos-duration="1500"
                  key={v4()}
                  w="80px"
                  mx="20px"
                >
                  {img}
                  {/* <Image src={img} alt="language" w="80px" mx="20px" /> */}
                </Box>
              );
            })}
          </Center>
          <Button
            mt="20px"
            onClick={() => onDown()}
            bg=""
            _hover={{}}
            _active={{}}
          >
            <Image src={DownArrow} w="50px" />
          </Button>
        </Center>
        <Box position="absolute" bottom="0px" zIndex="-1" w="100%" h="40%">
          <ImgLoad name="wave" />
        </Box>
      </Center>
      <Box
        ref={mainRef}
        as="section"
        bg="#fbfbfb"
        _dark={{ bg: "#1b1b1b" }}
        p="100px 0 0"
      >
        <Center m="0 auto" flexDir="column" pt="30px" w="800px">
          <Box w="100%" display="flex" alignItems="center" data-aos="fade-up">
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
            <Box w="200px" ml="50px">
              <ImgLoad name="codebox" />
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
            {squares.map((square, idx) => {
              return (
                <MainSquare
                  data={square}
                  key={v4()}
                  dir={idx % 2 === 0 ? "zoom-in-right" : "zoom-in-left"}
                />
              );
            })}
          </Center>
          {studyInfos.slice(3).map((info, idx) => {
            return (
              <MainBox
                dir={idx % 2 !== 0 ? "right" : "left"}
                data={info}
                key={v4()}
              />
            );
          })}
        </Center>
      </Box>
      <Box as="section" p="60px 0 0">
        <Center m="0 auto" flexDir="column" w="800px">
          <Box
            w="100%"
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
            data-aos="fade-up"
          >
            <Box w="200px" mr="50px">
              <ImgLoad name="notebook" />
            </Box>
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
        p="100px 0 0"
        bg={
          colorMode === "light"
            ? "linear-gradient(180deg, #FFFFFF 0%, #88BFFF 100%)"
            : "linear-gradient(180deg, #121212 0%, #1581FF 100%)"
        }
        flexDir="column"
      >
        <Center
          flexDir="column"
          h="100%"
          justifyContent="space-evenly"
          w="100%"
          position="relative"
        >
          <Text>더 이상 혼자가 아닌 스터디원들과 같이 알고리즘 공부하세요</Text>
          <Text display="flex" alignItems="center">
            <Image
              src={colorMode === "light" ? LogoLight : LogoDark}
              alt="logo"
              w="150px"
              mr="5px"
            />
            와 함께라면 더 높은 곳 까지 갈 수 있어요
          </Text>

          <Box position="absolute" w="200px" left="15%">
            <ImgLoad name="airplane" />
          </Box>
        </Center>
        <Box as="footer" h="200px" display="flex">
          <Box m="0 auto" w="1200px">
            <Box
              display="flex"
              flexDir="column"
              justifyContent="flex-end"
              alignItems="flex-end"
              mr="20px"
              h="100%"
              fontSize="12px"
            >
              <Text>connection by 우건공주와 다섯난쟁이</Text>
              <Text mb="60px">김우건 김윤민 김준우 염진호 이기영 최진합</Text>
              <Text mb="10px">© 2022 connection All Rights Reserved</Text>
            </Box>
          </Box>
        </Box>
      </Center>
    </Box>
  );
}

export default Main;
