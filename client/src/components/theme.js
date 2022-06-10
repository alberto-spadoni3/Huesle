import { grey } from "@mui/material/colors";

export const getDesignTokens = (mode) => ({
    palette: {
        mode,
        ...(mode === "light"
            ? {
                  // palette values for light mode
                  text: {
                      primary: grey[800],
                  },
              }
            : {
                  // palette values for dark mode
                  primary: {
                      main: "#42a5f5",
                      dark: grey[800],
                  },
                  action: {
                      active: grey[300],
                  },
                  background: {
                      default: "#303030",
                  },
                  text: {
                      primary: "#fff",
                      secondary: grey[300],
                  },
              }),
    },
});
