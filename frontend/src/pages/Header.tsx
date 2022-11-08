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
  Spacer,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { Link as ReactLink, useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { MoonIcon } from "@chakra-ui/icons";
import LogoLight from "../asset/img/logo_light.svg";
import LogoDark from "../asset/img/logo_dark.svg";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetUserInfo, updateExtension } from "../store/ducks/auth/authSlice";
import BackjoonModal from "../components/modal/BackjoonModal";
import GithubModal from "../components/modal/GithubModal";
import ExtensionModal from "../components/modal/ExtensionModal";
import AuthModal from "../components/modal/AuthModal";
import checkExtension from "../utils/checkExtension";
import { InitialStateType } from "../store/ducks/auth/auth.type";

interface menuType {
  title: string;
  link: string;
}

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [code, setCode] = useState("");
  const AllModal = useDisclosure();
  const location = useLocation();
  const auth = useAppSelector(state => state.auth) as InitialStateType;
  const dispatch = useAppDispatch();
  const navigator = useNavigate();

  const menus: menuType[] = [
    { title: "문제 추천", link: "/recommend" },
    { title: "스터디", link: "/study" },
    { title: "문제 풀기", link: "/study-with" }
  ];

  useEffect(() => {
    setCode(v4().substring(0, 6).toUpperCase());
  }, []);

  useEffect(() => {
    // 확장 프로그램 확인
    checkExtension(
      () => dispatch(updateExtension(true)),
      () => dispatch(updateExtension(false))
    );
    const { information, extension, check } = auth;
    if (check) {
      // if (!information.backjoonId || !information.ismember || !extension) {
      if (!information.backjoonId || !information.ismember) {
        AllModal.onOpen();
      } else {
        AllModal.onClose();
      }
    }
  }, [auth, location]);

  const logout = () => {
    dispatch(resetUserInfo());
    navigator("/");
  };

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

          {auth.check ? (
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
          <AuthModal
            isOpen={AllModal.isOpen}
            onClose={AllModal.onClose}
            content={
              !auth.information.backjoonId ? (
                <BackjoonModal code={code} />
              ) : !auth.information.ismember ? (
                <GithubModal />
              ) : // ) : !auth.extension ? (
              false ? (
                <ExtensionModal onClose={AllModal.onClose} />
              ) : null
            }
          />
        </Center>
      </Center>
    </Flex>
  );
}
export default Header;
