import React, { useEffect, useState } from "react";
import {
  Button,
  Center,
  Flex,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Modal,
  ModalOverlay,
  Spacer,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { Link as ReactLink, useLocation } from "react-router-dom";
import { v4 } from "uuid";
import { MoonIcon } from "@chakra-ui/icons";
import JoinModal from "../components/join/JoinModal";
import LogoLight from "../asset/img/logo_light.svg";
import LogoDark from "../asset/img/logo_dark.svg";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetUserInfo } from "../store/ducks/auth/authSlice";

interface menuType {
  title: string;
  link: string;
}

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLogin, setIsLogin] = useState(false);
  const [isBJ, setIsBJ] = useState(false);

  const location = useLocation();
  const auth = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  const menus: menuType[] = [
    { title: "문제 추천", link: "/recommend" },
    { title: "스터디", link: "/study" },
    { title: "문제 풀기", link: "/study-with" }
  ];

  useEffect(() => {
    setIsLogin(auth.check);
    if (auth.check) {
      if (auth.information?.backjoonId) {
        setIsBJ(true);
      }
    }
  }, [auth]);

  useEffect(() => {
    if (!isBJ && isLogin) {
      onOpen();
    }
  }, [isBJ, isLogin, location]);

  function logout() {
    dispatch(resetUserInfo());
  }

  return (
    <Flex
      boxShadow="md"
      position="sticky"
      top="0px"
      bg={colorMode === "light" ? "white" : "#121212"}
      zIndex="5"
    >
      <Center maxW="1200px" m="0 auto" w="100%" flex={1}>
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
        <Center p="14px" w="540px" justifyContent="left" flex={6}>
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
        <Center p="14px" flex={1} minW="170px">
          <Button mr="14px" onClick={toggleColorMode}>
            <MoonIcon />
          </Button>

          {isLogin ? (
            <Menu>
              <MenuButton>
                <Image
                  src={auth.information?.imageUrl}
                  borderRadius="50px"
                  minW="35px"
                  w="35px"
                />
              </MenuButton>
              <MenuList _dark={{ bg: "#121212" }}>
                <MenuGroup title={`${auth.information?.name}님 반가워요😀`}>
                  <MenuItem onClick={() => logout()}>로그아웃</MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          ) : (
            <Link
              href={`${process.env.REACT_APP_API_URL}/oauth2/authorize/github?redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URL}`}
              _hover={{}}
            >
              <Button>로그인</Button>
            </Link>
          )}
          <Button onClick={onOpen}>백준</Button>
          <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
            <ModalOverlay />
            <JoinModal onClose={onClose} />
          </Modal>
        </Center>
      </Center>
    </Flex>
  );
}
export default Header;
