import {
    Box,
    Container,
    Card,
    CardActions,
    CardContent,
    Typography,
    Link,
} from "@mui/material";
import React from "react";
import { Link as RouterLink } from "react-router-dom";

const Home = () => {
    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "600px",
            }}
        >
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5">Homepage</Typography>
                </CardContent>
                <CardActions>
                    <Link component={RouterLink} to="/login">
                        Login page
                    </Link>
                </CardActions>
            </Card>
        </Container>
    );
};

export default Home;
