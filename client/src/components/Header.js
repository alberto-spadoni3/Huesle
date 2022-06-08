import React from "react";
import { Container, Typography } from "@mui/material";

const Header = () => {
    return (
        <header>
            <Container
                maxWidth={"sm"}
                sx={{
                    position: "sticky",
                    top: 10,
                    width: "100%",
                    borderBottom: "2px solid black",
                }}
            >
                <Typography variant="h3" sx={{ margin: 1 }}>
                    Huesle
                </Typography>
            </Container>
        </header>
    );
};

export default Header;
