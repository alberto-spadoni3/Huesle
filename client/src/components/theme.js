import { grey } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                  // palette values for light mode
                  /* primary: {
                      main: "#6573C3",
                  }, */
                  text: {
                      primary: grey[900],
                      link: "#2692E6",
                  },
                  link: {
                      main: "#2692E6",
                  },
                  action: {
                      button: "#6573C3",
                      active: grey[800],
                  },
                  colorBox: {
                      main: grey[900],
                  },
              }
            : {
                  // palette values for dark mode
                  /* primary: {
                      main: "#3f51b5",
                      button: "#3f51b5",
                      //dark: grey[800],
                  }, */
                  action: {
                      active: grey[100],
                  },
                  button: {
                      main: "#3f51b5",
                  },
                  background: {
                      default: "#303030",
                      paper: "#1a1a1a",
                      dashboardMenu: "#262626",
                  },
                  tooltip: {
                      main: "#404040",
                  },
                  link: {
                      main: "#2692E6",
                  },
                  text: {
                      primary: grey[200],
                      secondary: grey[300],
                  },
                  colorBox: {
                      main: grey[900],
                  },
                  neutral: {
                      main: "#64748B",
                      contrastText: "#fff",
                  },
              }),
    },
});
