import React from "react";
import { Typography, Link, Box, Container } from "@mui/material";

const Footer = () => {
    return (
        <footer>
            <Container
                maxWidth={"sm"}
                sx={{
                    position: "fixed",
                    display: "flex",
                    justifyContent: "center",
                    bottom: 2,
                    right: 0,
                    left: 0,
                }}
            >
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1, mb: 1 }}
                    align="center"
                >
                    {"Copyright © "}
                    <Link
                        color="inherit"
                        href="https://github.com/alberto-spadoni3"
                    >
                        Alberto Spadoni
                    </Link>
                    {", "}
                    <Link
                        color="inherit"
                        href="https://github.com/lorenzo-osimani"
                    >
                        Lorenzo Osimani
                    </Link>
                    {" - "}
                    {new Date().getFullYear()}
                </Typography>
            </Container>
        </footer>
    );
};

export default Footer;
