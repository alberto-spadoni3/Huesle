import { grey } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                  // palette values for light mode
                  primary: {
                      main: "#6573C3",
                  },
                  text: {
                      primary: grey[800],
                      link: "#2692E6",
                  },
                  action: {
                      active: grey[800],
                  },
              }
            : {
                  // palette values for dark mode
                  primary: {
                      main: "#3f51b5",
                      //dark: grey[800],
                  },
                  action: {
                      active: grey[100],
                  },
                  background: {
                      default: "#303030",
                      paper: "#1a1a1a",
                      dashboardMenu: "#262626",
                  },
                  tooltip: {
                      main: "#404040",
                  },
                  text: {
                      link: "#2692E6",
                      primary: "#fff",
                      secondary: grey[300],
                  },
              }),
    },
});
