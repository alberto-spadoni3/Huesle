import React from "react";
import { useNavigate } from "react-router-dom";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Button, Container, IconButton, Typography } from "@mui/material";

const Header = () => {
    const navigate = useNavigate();

    const handleClick = (event) => {
        navigate("/settings");
    };

    return (
        <Box>
            <Container
                maxWidth="md"
                sx={{
                    display: "flex",
                    justifyContent: "space-evenly",
                    alighItems: "center",
                    paddingTop: 1,
                }}
            >
                <Typography
                    variant="h3"
                    sx={{
                        textAlign: "center",
                    }}
                >
                    Huesle
                </Typography>
                <IconButton onClick={handleClick} aria-label="Settings">
                    <SettingsIcon
                        sx={{
                            border: "2px solid",
                            borderColor: "palette.text.secondary",
                            borderRadius: "10px",
                            padding: "2px",
                        }}
                    />
                </IconButton>
            </Container>
        </Box>
    );
};

export default Header;
