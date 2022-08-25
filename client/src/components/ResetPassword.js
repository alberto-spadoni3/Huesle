import SaveIcon from "@mui/icons-material/Save";
import {TextField, Typography, Box, Button, Divider, Avatar, Stack, Fade} from "@mui/material";
import BackButton from "./BackButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
    BACKEND_UPDATE_USERNAME,
    BACKEND_UPDATE_PASSWORD_ENDPOINT, BACKEND_CHECK_REQUEST_TOKEN_ENDPOINT, BACKEND_RESET_PASSWORD_ENDPOINT,
} from "../api/backend_endpoints";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import {useNavigate, useSearchParams} from "react-router-dom";
import Loading from "./Loading";
import axios from "../api/axios";

const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function ResetPassword() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);

    const [matchPassword, setMatchPassword] = useState("");
    const [validMatchPassword, setValidMatchPassword] = useState(false);

    const [loading, setLoading] = useState(true);
    const [waitingResponse, setWaitingResponse] = useState(false);
    const [validToken, setValidToken] = useState(false);

    const [searchParams] = useSearchParams();

    const verifyToken = async () => {
        const token = searchParams.get("token");
        try {
            const response = await axios.post(
                BACKEND_CHECK_REQUEST_TOKEN_ENDPOINT,
                JSON.stringify({
                    token
                }), {
                    headers: {"Content-Type": "application/json"},
                    withCredentials: true,
                })

            setUsername(response.data.username);
            setValidToken(true);
        } catch (error) {
            console.log("error");
            setValidToken(false);
        }
        setLoading(false);
    };

    useEffect(() => {
       verifyToken();
    }, []);

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatchPassword(password === matchPassword);
    }, [password, matchPassword]);

    const handleResetPassword = async (e) => {
        const passwordPresentAndValid =
            password.trim() !== "" && validPassword && validMatchPassword;

        if (passwordPresentAndValid) {
            try {
                setWaitingResponse(true);
                const response = await axios.post(
                    BACKEND_RESET_PASSWORD_ENDPOINT,
                    JSON.stringify({
                        username,
                        password,
                        token: searchParams.get("token")
                    }),
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );
                if (response.status === 200) {
                    enqueueSnackbar("Password updated successfully, try signing in again", {
                        variant: "success",
                    });
                    navigate("/", {replace: true});
                }
            } catch (error) {
                if (!error?.response) {
                    enqueueSnackbar("No Server Response", { variant: "info" });
                } else if (error.response?.status === 400) {
                    enqueueSnackbar(error.response?.data?.message, {
                        variant: "error",
                    });
                } else {
                    enqueueSnackbar("Password update Failed", {
                        variant: "error",
                    });
                }
            }
            setWaitingResponse(false);
            verifyToken();
        } else {
            const message = !validPassword?
                    "The password selected is not valid. It must contain at least 8 characters, a number, " +
                "a lower and a higher case letter and a special character.":
                "The two password inserted don't match";
            enqueueSnackbar(message, { variant: "warning" });
        }
    };

    return (
        <>
            {loading? (<Loading/>) :
                (<>
                    {validToken?
                        (<Fade in={true}>
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
                                    mt: 11,
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
                                Reset Password
                            </Typography>
                            <Box
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    marginTop: 2,
                                }}
                            >
                                <Box justifyContent="flex-start" width="inherit" >
                                    <TextField
                                        fullWidth
                                        required
                                        error={!validPassword && password ? true : false}
                                        name="newPassword"
                                        label="New Password"
                                        type="password"
                                        id="newPassword"
                                        autoComplete="off"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        sx={{ mt: 3 }}
                                    />
                                    <TextField
                                        fullWidth
                                        required
                                        error={
                                            !validMatchPassword && matchPassword
                                                ? true
                                                : false
                                        }
                                        name="matchNewPassword"
                                        label="Confirm New Password"
                                        type="password"
                                        id="matchNewPassword"
                                        autoComplete="off"
                                        value={matchPassword}
                                        onChange={(e) => setMatchPassword(e.target.value)}
                                        sx={{ mt: 3 }}
                                    />
                                    <Typography component={'div'} variant="body2" sx={{ mt: 3, ml: 1}} align="left">
                                        Insert new password for user <Box fontStyle='italic' display='inline'>{username}</Box>
                                    </Typography>
                                </Box>
                            </Box>
                            <Button
                                sx={{
                                    width: "100%",
                                    height: "50px",
                                    margin: "24px 0 24px 0",
                                }}
                                variant="contained"
                                disabled={waitingResponse}
                                startIcon={<SaveIcon />}
                                aria-label="Set New Password"
                                color="button"
                                onClick={handleResetPassword}
                            >
                                Save changes
                            </Button>
                        </Box>
                        </Fade>
                        )
                        :
                        (
                            <Fade in={true}>
                            <Box
                                sx={{
                                    height: "30vh",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mt: 6
                                }}
                            >
                                <Stack spacing={1}>
                                    <Typography variant="body1" align="center">This link is not valid or has already expired and no longer usable to reset a password!</Typography>
                                    <Button variant="outlined" color="button" onClick={() => navigate("/")}>
                                        Go to the Homepage
                                    </Button>
                                </Stack>
                            </Box>
                            </Fade>
                        )
                    }
                </>
                )
            }
        </>
    );
};
