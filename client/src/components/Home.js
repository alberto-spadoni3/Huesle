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
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { auth } = useAuth();
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
                    <Typography variant="h5">
                        Homepage - {auth?.username}
                    </Typography>
                </CardContent>
                <CardActions>
                    <Link component={RouterLink} to="/login">
                        Login page
                    </Link>
                    <Link component={RouterLink} to="/user">
                        User
                    </Link>
                </CardActions>
            </Card>
        </Box>
    );
};

export default Home;
