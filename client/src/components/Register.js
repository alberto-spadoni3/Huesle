import React from "react";
import { useState, useEffect } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import axios from "../api/axios";
import BackButton from "./BackButton";
import { useSnackbar } from "notistack";
import { BACKEND_REGISTRATION_ENDPOINT } from "../api/backend_endpoints";
import {Fade} from "@mui/material";

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Register() {
    const { enqueueSnackbar } = useSnackbar();

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);

    const [matchPassword, setMatchPassword] = useState("");
    const [validMatchPassword, setValidMatchPassword] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password));
        setValidMatchPassword(password === matchPassword);
    }, [password, matchPassword]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (
            !validEmail ||
            !validUsername ||
            !validPassword ||
            !validMatchPassword
        ) {
            let message = "";
            if (!validUsername) message = "The username selected is not valid.";
            else if (!validEmail) message = "The email selected is not valid.";
            else if (!validPassword)
                message =
                    "The password selected is not valid. It must contain at least 8 characters, a number, a lower and a higher case letter and a special character.";
            else if (!validMatchPassword)
                message = "The two password inserted don't match";
            enqueueSnackbar(message, { variant: "warning" });
            return;
        }

        try {
            const response = await axios.post(
                BACKEND_REGISTRATION_ENDPOINT,
                JSON.stringify({ email, username, password }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            if (response?.status === 201) {
                enqueueSnackbar(
                    "Your account is created successfully. You can now login!",
                    {
                        variant: "success",
                    }
                );
                navigate("/login", { replace: true });
            }
        } catch (error) {
            if (!error?.response) {
                console.log("No Server Response");
                enqueueSnackbar("No server response", {
                    variant: "info",
                });
            } else if (error.response?.status === 400) {
                console.log(error.response?.data?.message);
                enqueueSnackbar(error.response?.data?.message, {
                    variant: "warning",
                });
            } else if (error.response?.status === 409) {
                console.log(error.response?.data?.message);
                enqueueSnackbar(error.response?.data?.message, {
                    variant: "warning",
                });
            } else {
                console.log("Registration Failed " + error.message);
                enqueueSnackbar("Registration Failed", {
                    variant: "error",
                });
            }
        }
    };

    return (
        <>
            <BackButton />
            <Fade in={true}>
                <Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <Avatar
                            sx={{
                                m: 1,
                                bgcolor: "gray",
                                width: 64,
                                height: 64,
                            }}
                        >
                            <LockOutlinedIcon
                                fontSize="large"
                                style={{ color: "white" }}
                            />
                        </Avatar>
                        <Typography component="h1" variant="h4">
                            Sign up
                        </Typography>

                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ mt: 3 }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={!validEmail && email ? true : false}
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={
                                            !validUsername && username ? true : false
                                        }
                                        id="username"
                                        label="Username"
                                        name="username"
                                        autoComplete="off"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={
                                            !validPassword && password ? true : false
                                        }
                                        name="password"
                                        label="Password"
                                        type="password"
                                        id="password"
                                        autoComplete="off"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        required
                                        fullWidth
                                        error={
                                            !validMatchPassword && matchPassword
                                                ? true
                                                : false
                                        }
                                        name="matchPassword"
                                        label="Confirm Password"
                                        type="password"
                                        id="matchPassword"
                                        autoComplete="off"
                                        value={matchPassword}
                                        onChange={(e) =>
                                            setMatchPassword(e.target.value)
                                        }
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="button"
                                sx={{ mt: 3, mb: 1 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link
                                        component={RouterLink}
                                        to="/login"
                                        variant="body2"
                                    >
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}
