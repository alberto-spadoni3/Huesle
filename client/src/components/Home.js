import {
    Box,
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
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Card variant="outlined" sx={{ marginBottom: "200px" }}>
                <CardContent>
                    <Typography variant="h5">Homepage</Typography>
                </CardContent>
                <CardActions>
                    <Link
                        component={RouterLink}
                        to="/dashboard"
                        color="link.main"
                    >
                        Dashboard
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/searchMatch"
                        color="link.main"
                    >
                        SearchMatch
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/gameboard"
                        color="link.main"
                    >
                        Game Board
                    </Link>
                    <Link
                        component={RouterLink}
                        to="/match-details"
                        color="link.main"
                    >
                        Match
                    </Link>
                </CardActions>
            </Card>
        </Box>
    );
};

export default Home;
