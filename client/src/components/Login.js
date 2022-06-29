import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Grid,
    Typography,
    Button,
    TextField,
    Avatar,
    Link,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import BackButton from "./BackButton";
import { BACKEND_LOGIN_ENDPOINT } from "../api/backend_endpoints";

export default function Login() {
    const { setAuth, persist, setPersist } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [snackbarAlertState, setSnackbarAlertState] = React.useState({
        open: false,
        message: "",
        severity: "success"
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log(snackbarAlertState);
            const response = await axios.post(
                BACKEND_LOGIN_ENDPOINT,
                JSON.stringify({ username, password }),
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );

            // let's take and store the accessToken given by the backend
            const accessToken = response?.data?.accessToken;
            setAuth({ username, accessToken });

            // cleaning the form
            setUsername("");
            setPassword("");

            navigate(from, { replace: true });
            setSnackbarAlertState({open: true, message: "Login Successful", severity: "success"});
        } catch (error) {
            if (!error?.response) {
                console.log("No Server Response");
                setSnackbarAlertState({open: true, message: "No Server Response", severity: "error"});
            } else if (error.response?.status === 400) {
                console.log("Missing Username or Password");
                setSnackbarAlertState({open: true, message: "Missing Username or Password", severity: "warning"});
            } else if (error.response?.status === 401) {
                console.log("Unauthorized");
                setSnackbarAlertState({open: true, message: "Unauthorized", severity: "error"});
            } else {
                console.log("Login Failed");
                setSnackbarAlertState({open: true, message: "Login Failed", severity: "info"});
            }
        }
    };

    const togglePersist = () => {
        setPersist((previousValue) => !previousValue);
    };

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist]);

    return (
        <>
            <SnackbarAlert state={snackbarAlertState} setState={setSnackbarAlertState} />
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
                    Sign in
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 3 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        autoComplete="off"
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        autoComplete="off"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                value="remember"
                                color="primary"
                                checked={persist}
                                onChange={togglePersist}
                            />
                        }
                        label="Trust this device"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        // color="primary"
                        sx={{ mt: 3, mb: 1 }}
                    >
                        Sign In
                    </Button>
                    <Grid
                        container
                        direction="column"
                        justifyContent="flex-start"
                        alignItems="flex-end"
                    >
                        <Grid item xs>
                            <Link variant="body2">Forgot password?</Link>
                        </Grid>
                        <Grid item>
                            <Link
                                ariant="body2"
                                component={RouterLink}
                                to="/register"
                            >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </>
    );
}
