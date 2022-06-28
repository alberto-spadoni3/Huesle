import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import MainContainer from "./MainContainer";
import { useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { BACKEND_SETTINGS_ENDPOINT } from "../api/backend_endpoints";

const Layout = ({ setThemeMode }) => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    // this useEffect it's used to load the preferred theme mod after the login is done
    useEffect(() => {
        if (auth?.username) {
            axiosPrivate
                .get(BACKEND_SETTINGS_ENDPOINT)
                .then((response) => {
                    if (response.status === 200) {
                        const themeMode = response?.data?.darkMode
                            ? "dark"
                            : "light";
                        setThemeMode(themeMode);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [auth.username]);

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
