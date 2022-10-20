import React from "react";
import "./App.css";
import { Box, Button, useColorMode } from "@chakra-ui/react";

function App() {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <div className="App">
      <Button onClick={toggleColorMode} bg="dep_1">
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
      <Button onClick={toggleColorMode} bg="dep_2">
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
      <Button onClick={toggleColorMode} bg="dep_3">
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
      <Button onClick={toggleColorMode} bg="gra">
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
      <Button onClick={toggleColorMode} bg="lighter_lin">
        Toggle {colorMode === "light" ? "Dark" : "Light"}
      </Button>
    </div>
  );
}

export default App;
