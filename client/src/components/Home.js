import {
    Box,
    Card,
    CardActions,
    CardContent,
    Typography,
    Divider,
    Button, Fade, Stack,
} from "@mui/material";
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Home = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    return (
        <Fade in={true}>
        <Box
            sx={{
                display: "flex",
                marginTop: "30%",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {auth.username ? (
                <Navigate to="/dashboard" />
            ) : (
                <>
                    <Stack align="column" alignItems={"center"}>
                    <Card variant="outlined" sx={{ marginBottom: "60px" }}>
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
                                sx={{ color: "text.secondary" }}
                            >
                                Log in
                            </Button>
                            <Button
                                variant="outlined"
                                size="small"
                                sx={{ color: "text.secondary" }}
                                onClick={() => navigate("/register")}
                            >
                                Create an account
                            </Button>
                        </CardActions>
                    </Card>
                    <Card variant="outlined" sx={{width:"80%"}}>
                        <CardContent>
                            <Typography variant="h5" align="center">
                                Before rushing in...
                            </Typography>
                            <Divider
                                sx={{ marginY: 1, borderBottomWidth: "thick" }}
                            />
                            <Typography variant="body1" align="center">
                                ...learn the rules of the game!
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
                                onClick={() => navigate("/rules")}
                                sx={{ color: "text.secondary" }}
                            >
                                How To Play
                            </Button>
                        </CardActions>
                    </Card>
                    </Stack>
                </>
            )}
        </Box>
        </Fade>
    );
};

export default Home;
