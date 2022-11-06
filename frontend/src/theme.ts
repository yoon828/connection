import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const fonts = {
  body: "NotoSans"
};

const styles = {
  global: {
    body: {
      _light: {
        bg: "white"
      },
      _dark: {
        bg: "#121212"
      }
    }
  }
};

const semanticTokens = {
  colors: {
    light: {
      100: "#F7F8F9",
      200: "#E9EBEE",
      300: "#C5C8CD"
    },
    dark: {
      100: "#2F363A",
      200: "#42474B",
      300: "#5B6165"
    },
    dep_1: {
      _light: "#F7F8F9",
      _dark: "#2F363A"
    },
    dep_2: {
      _light: "#E9EBEE",
      _dark: "#42474B"
    },
    dep_3: {
      _light: "#C5C8CD",
      _dark: "#5B6165"
    },
    gra: {
      _light: "linear-gradient(180deg, #B2D6FF, #64ABFF)",
      _dark: "linear-gradient(180deg, #88BFFF, #1581FF)"
    },
    lighter_lin: {
      default: "linear-gradient(180deg, #E1EFFF, #BBDBFF)"
    },
    white_lin: {
      _light: "linear-gradient(180deg, #B2D6FF, #F7F8F9)",
      _dark: "linear-gradient(180deg, #88BFFF, #1581FF)"
    },
    main: {
      default: "#1581FF"
    },
    sub: {
      _light: "#B2D6FF",
      _dark: "linear-gradient(180deg, #88BFFF, #1581FF)"
    },
    dark_bg: {
      default: "#121212"
    },
    red_lin: {
      _light: "linear-gradient(180deg, #FF5252 0%, #D04545 100%)",
      _dark: "linear-gradient(180deg, #FF4848 0%, #B93B3B 100%)"
    },
    border_gray: {
      _light: "#d1d1d1",
      _dark: "#717171"
    },
    custom_red: {
      default: "#ff6464"
    },
    solved: {
      _light: "#6fb2ff",
      _dark: "#1581FF"
    }
  }
};

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true
};

const customTheme = extendTheme({ semanticTokens, config, styles, fonts });
export default customTheme;
