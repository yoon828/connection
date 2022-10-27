import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { Provider } from "react-redux";
import App from "./App";
import theme from "./theme";
import "./asset/fonts/font.css";

import { setUpStore } from "./store";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
const store = setUpStore();
root.render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </Provider>
);
