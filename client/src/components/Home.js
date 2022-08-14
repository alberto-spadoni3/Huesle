import {
    Box,
    Card,
    CardActions,
    CardContent,
    Typography,
    Divider,
    Button,
} from "@mui/material";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {auth.username ? (
                <Navigate to="/dashboard" />
            ) : (
                <>
                    <Card variant="outlined" sx={{ marginBottom: "200px" }}>
                        <CardContent>
                            <Typography variant="h4" align="center">
                                You are not logged in
                            </Typography>
                            <Divider
                                sx={{ marginY: 1, borderBottomWidth: "thick" }}
                            />
                            <Typography variant="body1" align="center">
                                If you want to start playing the game, you first
                                need to create an account and login.
                            </Typography>
                        </CardContent>
                        <Divider />
                        <CardActions
                            sx={{
                                display: "flex",
                                justifyContent: "space-evenly",
                            }}
                        >
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate("/login")}
                            >
                                Log in
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => navigate("/register")}
                            >
                                Create an account
                            </Button>
                        </CardActions>
                    </Card>
                </>
            )}
        </Box>
    );
};

export default Home;
