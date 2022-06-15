import { Box, Container, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <Box bgcolor="background.default" color="text.secondary" height="100vh">
            <Header />
            <Outlet />
        </Box>
    );
};

export default Layout;
