import { grey } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
    typography: {
        body1: {
            fontSize: "1.1rem",
        },
    },
    palette: {
        mode,
        ...(mode === "light"
            ? {
                  text: {
                      primary: "#1F1F1F",
                      secondary: "#2F2F2F"
                  },
                  link: {
                      main: "#2692E6",
                  },
                  action: {
                      active: grey[800],
                  },
                  button: {
                      main: "#72bddb",
                      pulsing: "coral"
                  },
                  colorBox: {
                      main: grey[900],
                  },
                  neutral: {
                      main: "#64748B",
                      contrastText: "#fff",
                  },
                  background: {
                      default: "#FFFFFF",
                      border: "#c6cac6",
                      paper: "#E6E8E6",
                      dashboardMenu: "#E6E8E6",
                  },
                  gameboard: {
                      background: "#DCCCBB",
                      position: "#009E73",
                      color: "#F0E442",
                      hintPosition: "#000000",
                      hintColor: "#5e5e5e",
                      hintLabel: "#ffffff"
                  },
                  switch: {
                      main: "#69b6c7",
                  },
              }
            : {
                  // palette values for dark mode
                  text: {
                      primary: grey[200],
                      secondary: "#D9DCD6",
                  },
                  link: {
                      main: "#2692E6",
                  },
                  action: {
                      active: grey[100],
                  },
                  button: {
                      main: "#388697",
                      pulsing: "coral",
                      inactive: "#6b6e70",
                      negative: "#388697",
                  },
                  colorBox: {
                      main: grey[900],
                  },
                  neutral: {
                      main: "#64748B",
                      contrastText: "#fff",
                  },
                  background: {
                      default: "#1F1F1F",
                      border: "#3c3c3c",
                      paper: "#2F2F2F",
                      dashboardMenu: "#2F2F2F",
                  },
                  gameboard: {
                      background: "#433423",
                      position: "#009E73",
                      color: "#F0E442",
                      hintPosition: "#ffffff",
                      hintColor: "#a3a3a3",
                      hintLabel: "#000000"
                  },
                  switch: {
                      main: "#388697",
                  },
              }),
    },
});
