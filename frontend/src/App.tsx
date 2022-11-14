import React from "react";
import { Center, Highlight, Image, Text } from "@chakra-ui/react";
import Routes from "./pages/routes/Routes";
import "./App.css";
import sexyUgeon from "./asset/img/sexyUgeon.webp";

function App() {
  return (
    <>
      <Routes />
      <Center
        w="100%"
        h="100%"
        position="fixed"
        background="bg"
        zIndex={99}
        top={0}
        id="limit-page"
      >
        <Image
          src={sexyUgeon}
          w="30vw"
          h="30vw"
          position="absolute"
          bottom={0}
          right={0}
        />

        <Text fontSize="4vw" fontWeight={800}>
          <Highlight
            query="1200px"
            styles={{
              px: "4",
              py: "1",
              rounded: "full",
              fontWeight: 600,
              bg: "gra",
              color: "chakra-body-text"
            }}
          >
            코넥션은 1200px 이상만 지원하고 있어요 :(
          </Highlight>
        </Text>
        {/* <Text fontSize="4vw" fontWeight={800} /> */}
      </Center>
    </>
  );
}

export default App;
