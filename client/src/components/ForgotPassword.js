import React, { useEffect, useState } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    TextField,
    Avatar, Fade,
} from "@mui/material";
import PermIdentityRoundedIcon from '@mui/icons-material/PermIdentityRounded';
import axios from "../api/axios";
import BackButton from "./BackButton";
import { useSnackbar } from "notistack";
import {BACKEND_FORGOT_PASSWORD_ENDPOINT, BACKEND_LOGIN_ENDPOINT} from "../api/backend_endpoints";

export default function ForgotPassword() {
    const { enqueueSnackbar } = useSnackbar();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await axios.get(
                BACKEND_FORGOT_PASSWORD_ENDPOINT,
                {
                    params: {username, email},
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                }
            );

            navigate("/", {replace: true});
                enqueueSnackbar("Email sent at the address specified!", {
                    variant: "info",
                    autoHideDuration: 2500,
                });

        } catch (error) {
            if (!error?.response) {
                enqueueSnackbar({
                    variant: "info",
                });
            } else if (error.response?.status === 404) {
                enqueueSnackbar("Username or email not valid", {
                    variant: "warning",
                });
            } else if (error.response?.status === 405) {
                enqueueSnackbar("An email has already been sent to that address, check your mail box", {
                    variant: "info",
                });
            } else {
                enqueueSnackbar("Server Error", {
                    variant: "error",
                });
            }
        }
        setLoading(false);
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
                            <PermIdentityRoundedIcon
                                fontSize="large"
                                style={{ color: "white" }}
                            />
                        </Avatar>
                        <Typography component="h1" variant="h4">
                            Forgot Password
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
                                name="email"
                                label="Email"
                                type="email"
                                id="email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                autoComplete="off"
                            />
                            <Typography component="h1" variant="body1" sx={{ mt: 2.5, ml: 1 }}>
                                Insert the username and email of the account to recover.
                            </Typography>
                            {!loading ? (<Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="button"
                                    sx={{mt: 1.5, mb: 1}}
                                >
                                    Send Reset Email
                                </Button>)
                                :
                                (<Button
                                    type="submit"
                                    disabled={true}
                                    fullWidth
                                    variant="contained"
                                    color="button"
                                    sx={{mt: 1.5, mb: 1}}
                                >
                                    Checking account...
                                </Button>)
                            }
                        </Box>
                    </Box>
                </Box>
            </Fade>
        </>
    );
}
