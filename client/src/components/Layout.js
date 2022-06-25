import { Box, Container, Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import MainContainer from "./MainContainer";

const Layout = () => {
    return (
        <Box bgcolor="background.default" color="text.secondary" height="100vh">
            <Header />
            <MainContainer>
                <Outlet />
            </MainContainer>
        </Box>
    );
};

export default Layout;
