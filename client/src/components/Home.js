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
                    <Link component={RouterLink} to="/login">
                        Login page
                    </Link>
                    <Link component={RouterLink} to="/dashboard">
                        Dashboard
                    </Link>
                </CardActions>
            </Card>
        </Box>
    );
};

export default Home;
