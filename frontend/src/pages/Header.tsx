import React, { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
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
  Spinner,
  Toast,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { Link as ReactLink, useLocation, useNavigate } from "react-router-dom";
import { v4 } from "uuid";
import { quitUser } from "api/auth";
import useToast from "hooks/useToast";
import LogoLight from "../asset/img/logo_light.svg";
import LogoDark from "../asset/img/logo_dark.svg";
import GithubLight from "../asset/img/githubL.svg";
import GithubDark from "../asset/img/githubD.svg";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { resetUserInfo, updateExtension } from "../store/ducks/auth/authSlice";
import BackjoonModal from "../components/modal/BackjoonModal";
import GithubModal from "../components/modal/GithubModal";
import ExtensionModal from "../components/modal/ExtensionModal";
import AuthModal from "../components/modal/AuthModal";
import checkExtension from "../utils/checkExtension";
import { InitialStateType } from "../store/ducks/auth/auth.type";
import DarkmodeButton from "../components/darkmode";

interface menuType {
  title: string;
  link: string;
}

function Header() {
  const { colorMode, toggleColorMode } = useColorMode();
  const [code, setCode] = useState("");
  const [loging, setLoging] = useState(false);
  const { onClose, onOpen, isOpen } = useDisclosure();
  const location = useLocation();
  const auth = useAppSelector(state => state.auth) as InitialStateType;
  const dispatch = useAppDispatch();
  const navigator = useNavigate();
  const toast = useToast();
  const quitAlert = useDisclosure();
  const cancelRef = useRef(null);

  const menus: menuType[] = [
    { title: "문제 추천", link: "/recommend" },
    { title: "스터디", link: "/study" },
    { title: "문제 풀기", link: "/study-with" }
  ];

  useEffect(() => {
    // onOpen();
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
      if (!information.backjoonId || !information.ismember || !extension) {
        onOpen();
      } else {
        onClose();
      }
    }
  }, [auth, location]);

  const logout = () => {
    dispatch(resetUserInfo());
    navigator("/");
    if (quitAlert.isOpen) {
      quitAlert.onClose();
    }
  };

  const userQuit = async () => {
    navigator("/");
    const { data } = await quitUser();
    if (data.check) {
      toast({
        title: "회원탈퇴가 완료되었습니다.",
        position: "top",
        isClosable: true,
        status: "info"
      });
      logout();
    } else {
      toast({
        title: "회원탈퇴 과정 중 문제가 발생했습니다.",
        position: "top",
        isClosable: true,
        status: "error"
      });
    }
  };

  return (
    <Flex
      boxShadow="md"
      position="sticky"
      top="0px"
      bg={colorMode === "light" ? "white" : "#121212"}
      zIndex="5"
      h="68px"
    >
      <Center maxW="1200px" minW="900px" m="0 auto" w="100%" flex={1}>
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
          {menus.map((menu, idx) => {
            return (
              <Link
                as={ReactLink}
                to={
                  idx !== 0 && !auth.information.studyName
                    ? "/study/join"
                    : menu.link
                }
                mr="50px"
                key={v4()}
                color={
                  `/${location.pathname.split("/")[1]}` === menu.link
                    ? "main"
                    : ""
                }
                _hover={{}}
                fontWeight="bold"
                fontSize={18}
              >
                {menu.title}
              </Link>
            );
          })}
        </Center>
        <Spacer />
        <Center p="14px" flex={1} minW="170px">
          <Center position="relative" mr="10px" onClick={toggleColorMode}>
            <DarkmodeButton />
          </Center>
          {auth.check ? (
            <Menu>
              <MenuButton>
                <Image
                  src={
                    auth.information?.imageUrl
                      ? auth.information?.imageUrl
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYS4ItI44R4hI66qjzhinqY5-Miyb30PelnQ&usqp=CAU" // 이미지 null일때 default img
                  }
                  borderRadius="50px"
                  minW="35px"
                  w="35px"
                />
              </MenuButton>
              <MenuList _dark={{ bg: "#121212" }}>
                <MenuGroup title={`${auth.information?.name}님 반가워요😀`}>
                  <MenuItem onClick={logout}>로그아웃</MenuItem>
                  <MenuItem onClick={quitAlert.onOpen} color="custom_red">
                    회원탈퇴
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          ) : (
            <Tooltip label="깃허브 로그인으로 이동합니다">
              <Link
                href={`${process.env.REACT_APP_API_URL}/oauth2/authorize/github?redirect_uri=${process.env.REACT_APP_OAUTH_REDIRECT_URL}`}
                _hover={{}}
              >
                <Button
                  onClick={() => setLoging(true)}
                  disabled={loging}
                  w="100px"
                >
                  {loging ? (
                    <Spinner />
                  ) : (
                    <Center>
                      로그인
                      <Image
                        w="18px"
                        ml="5px"
                        src={colorMode === "light" ? GithubLight : GithubDark}
                      />
                    </Center>
                  )}
                </Button>
              </Link>
            </Tooltip>
          )}
          <AuthModal
            isOpen={isOpen}
            onClose={onClose}
            status={
              !auth.information.backjoonId
                ? { content: <BackjoonModal code={code} />, percent: 1 }
                : !auth.information.ismember
                ? { content: <GithubModal />, percent: 51 }
                : !auth.extension
                ? {
                    content: <ExtensionModal onClose={onClose} />,
                    percent: 101
                  }
                : null
            }
          />
          <AlertDialog
            motionPreset="slideInBottom"
            leastDestructiveRef={cancelRef}
            onClose={quitAlert.onClose}
            isOpen={quitAlert.isOpen}
          >
            <AlertDialogOverlay />
            <AlertDialogContent>
              <AlertDialogHeader>회원탈퇴</AlertDialogHeader>
              <AlertDialogCloseButton />
              <AlertDialogBody>탈퇴하시겠습니까?😭</AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={quitAlert.onClose}>
                  No
                </Button>
                <Button colorScheme="red" ml={3} onClick={userQuit}>
                  Yes
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Center>
      </Center>
    </Flex>
  );
}
export default Header;
