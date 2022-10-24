import React from "react";
import {
  Button,
  Center,
  Flex,
  Image,
  Link,
  Spacer,
  useColorMode
} from "@chakra-ui/react";
import { Link as ReactLink } from "react-router-dom";
import { v4 } from "uuid";
import { MoonIcon } from "@chakra-ui/icons";
import LogoLight from "../asset/img/logo_light.png";
import LogoDark from "../asset/img/logo_dark.png";

interface menuType {
  title: string;
  link: string;
}

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();

  const menus: menuType[] = [
    { title: "문제 추천", link: "/recommend" },
    { title: "스터디", link: "/" },
    { title: "문제 풀기", link: "/" }
  ];

  return (
    <Flex boxShadow="lg">
      <Center p="14px">
        <Link as={ReactLink} to="/">
          <Image
            src={colorMode === "light" ? LogoLight : LogoDark}
            alt="logo"
            w="180px"
          />
        </Link>
      </Center>
      <Spacer />
      <Center p="14px" w="540px" justifyContent="left">
        {menus.map(menu => {
          return (
            <Link as={ReactLink} to={menu.link} mr="50px" key={v4()}>
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
        <Button>회원가입</Button>
      </Center>
    </Flex>
  );
}
export default Header;
