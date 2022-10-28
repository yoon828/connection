import React, { useEffect } from "react";
import {
  Button,
  Center,
  Flex,
  Image,
  Link,
  Modal,
  ModalOverlay,
  Spacer,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { Link as ReactLink, useLocation } from "react-router-dom";
import { v4 } from "uuid";
import { MoonIcon } from "@chakra-ui/icons";
import axios from "axios";
import JoinModal from "../components/join/JoinModal";
import LogoLight from "../asset/img/logo_light.svg";
import LogoDark from "../asset/img/logo_dark.svg";

interface menuType {
  title: string;
  link: string;
}

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const location = useLocation();

  function getAPI(e: any) {
    e.preventDefault();
    // 깃허브 로그인
    axios
      .get("https://www.coalla.co.kr/api/auth")
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  }

  const menus: menuType[] = [
    { title: "문제 추천", link: "/recommend" },
    { title: "스터디", link: "/study" },
    { title: "문제 풀기", link: "/study-with" }
  ];

  return (
    <Flex
      boxShadow="md"
      position="sticky"
      top="0px"
      bg={colorMode === "light" ? "white" : "#121212"}
      zIndex="5"
    >
      <Center maxW="1200px" m="0 auto" w="100%">
        <Center p="14px">
          <Link as={ReactLink} to="/">
            <Image
              src={colorMode === "light" ? LogoLight : LogoDark}
              alt="logo"
              w="150px"
            />
          </Link>
        </Center>
        <Spacer />
        <Center p="14px" w="540px" justifyContent="left">
          {menus.map(menu => {
            return (
              <Link
                as={ReactLink}
                to={menu.link}
                mr="50px"
                key={v4()}
                color={location.pathname === menu.link ? "main" : ""}
                _hover={{}}
                fontWeight="bold"
              >
                {menu.title}
              </Link>
            );
          })}
        </Center>
        <Spacer />
        <Center p="14px">
          <Button mr="14px" onClick={toggleColorMode}>
            <MoonIcon />
          </Button>
          <Link
            href={`${process.env.REACT_APP_API_BASE_URL}/oauth2/authorize/github?redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URL}`}
            _hover={{}}
          >
            <Button>로그인</Button>
            <Button onClick={e => getAPI(e)}>test</Button>
          </Link>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <JoinModal />
          </Modal>
        </Center>
      </Center>
    </Flex>
  );
}
export default Header;
