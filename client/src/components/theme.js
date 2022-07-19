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
                  button: {
                      main: "#3f51b5",
                  },
                  colorBox: {
                      main: grey[900],
                  },
                  neutral: {
                      main: "#64748B",
                      contrastText: "#fff",
                  },
              }
            : {
                  // palette values for dark mode
                  text: {
                      primary: grey[200],
                      secondary: grey[300],
                  },
                  link: {
                      main: "#2692E6",
                  },
                  action: {
                      active: grey[100],
                  },
                  button: {
                      main: "#3f51b5",
                  },
                  colorBox: {
                      main: grey[900],
                  },
                  neutral: {
                      main: "#64748B",
                      contrastText: "#fff",
                  },
                  background: {
                      default: "#303030",
                      paper: "#1a1a1a",
                      dashboardMenu: "#262626",
                  },
              }),
    },
});
