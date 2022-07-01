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
import SnackbarAlert from "./SnackbarAlert";
import { BACKEND_REGISTRATION_ENDPOINT } from "../api/backend_endpoints";

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function Register({ setSnackbarAlertState }) {
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
                setSnackbarAlertState({
                    open: true,
                    message:
                        "Your account is created successfully. You can now login!",
                    severity: "success",
                });
                navigate("/login", { replace: true });
            }
        } catch (error) {
            if (!error?.response) {
                console.log("No Server Response");
                setSnackbarAlertState({
                    open: true,
                    message: "No server response",
                    severity: "info",
                });
            } else if (error.response?.status === 409) {
                console.log(error.response?.data?.message);
                setSnackbarAlertState({
                    open: true,
                    message: error.response?.data?.message,
                    severity: "error",
                });
            } else {
                console.log("Registration Failed " + error.message);
                setSnackbarAlertState({
                    open: true,
                    message: "Registration Failed: " + error.message,
                    severity: "error",
                });
            }
        }
    };

    return (
        <>
            <BackButton />
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
                        bgcolor: "primary.main",
                        width: 64,
                        height: 64,
                    }}
                >
                    <LockOutlinedIcon fontSize="large" />
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
                        disabled={
                            !validEmail ||
                            !validUsername ||
                            !validPassword ||
                            !validMatchPassword
                        }
                        variant="contained"
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
        </>
    );
}
