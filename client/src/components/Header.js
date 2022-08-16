import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import { Box, Container, IconButton, Typography } from "@mui/material";
import AppSymbol from "./AppSymbol";

const Header = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const SettingsButton = () => {
        return (
            <IconButton
                onClick={(e) => navigate("/settings")}
                aria-label="settings"
            >
                <SettingsIcon
                    sx={{
                        border: "2px solid",
                        borderColor: "palette.text.secondary",
                        borderRadius: "10px",
                        padding: "2px",
                    }}
                />
            </IconButton>
        );
    };

    const LoginButton = () => {
        return (
            <IconButton onClick={(e) => navigate("/login")} aria-label="Login">
                <LoginIcon
                    sx={{
                        border: "2px solid",
                        borderColor: "palette.text.secondary",
                        borderRadius: "10px",
                        padding: "2px",
                    }}
                />
            </IconButton>
        );
    };

    return (
        <header>
            <Box>
                <Container
                    maxWidth="xs"
                    sx={{
                        display: "flex",
                        alighItems: "center",
                        paddingTop: 1,
                    }}
                >
                    <AppSymbol/>
                    <Typography
                        variant="h3"
                        color="text.primary"
                        sx={{
                            textAlign: "center",
                        }}
                    >
                        Huesle
                    </Typography>
                </Container>
            </Box>
        </header>
    );
};

export default Header;
