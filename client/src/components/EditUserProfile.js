import SaveIcon from "@mui/icons-material/Save";
import ArrowLeftRoundedIcon from "@mui/icons-material/ArrowLeftRounded";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";
import {
    Stack,
    TextField,
    Typography,
    Box,
    Button,
    IconButton,
    Avatar,
    Divider,
} from "@mui/material";
import BackButton from "./BackButton";
import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import useRefreshToken from "../hooks/useRefreshToken";
import { useState, useEffect } from "react";
import {
    BACKEND_UPDATE_USERNAME,
    BACKEND_UPDATE_PASSWORD,
} from "../api/backend_endpoints";

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const EditUserProfile = () => {
    const { auth, setAuth } = useAuth();
    const refresh = useRefreshToken();

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(false);

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(false);

    const [oldPassword, setOldPassword] = useState("");

    const [password, setPassword] = useState("");
    const [validPassword, setValidPassword] = useState(false);

    const [matchPassword, setMatchPassword] = useState("");
    const [validMatchPassword, setValidMatchPassword] = useState(false);

    useEffect(() => {
        setValidEmail(EMAIL_REGEX.test(email));
    }, [email]);

    useEffect(() => {
        setValidUsername(USERNAME_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPassword(PASSWORD_REGEX.test(password));
        setValidMatchPassword(password === matchPassword);
    }, [password, matchPassword]);

    const handleEditProfile = async (e) => {
        const newUsername = username.trim() !== "" ? username : auth.username;

        // update username if present
        if (username.trim() !== "" && validUsername) {
            console.log("updating username...");
            try {
                const response = await axios.post(
                    BACKEND_UPDATE_USERNAME,
                    JSON.stringify({
                        currentUsername: auth.username,
                        newUsername,
                    }),
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );

                if (response.status === 200) {
                    // refresh the username and the accessToken wich reflects the updated username
                    await refresh();
                    setUsername("");
                }
            } catch (error) {
                if (!error?.response) {
                    console.log("No Server Response");
                } else if (error.response?.status === 409) {
                    console.log(error.response?.data?.message);
                } else {
                    console.log("Username update failed");
                }
            }
        }

        if (password.trim() !== "" && validPassword && validMatchPassword) {
            try {
                const response = await axios.post(
                    BACKEND_UPDATE_PASSWORD,
                    JSON.stringify({
                        username: newUsername,
                        prevPassword: oldPassword,
                        newPassword: password,
                    }),
                    {
                        headers: { "Content-Type": "application/json" },
                        withCredentials: true,
                    }
                );

                if (response.status === 200) {
                    setOldPassword("");
                    setPassword("");
                    setMatchPassword("");
                }
            } catch (error) {
                if (!error?.response) {
                    console.log("No Server Response");
                } else if (error.response?.status === 401) {
                    console.log("Username not found in the database");
                } else if (error.response?.status === 400) {
                    console.log(error.response?.data?.message);
                } else {
                    console.log("Password update Failed");
                }
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
                <Stack direction="row" justifyContent="space-evenly">
                    <IconButton aria-label="select left image">
                        <ArrowLeftRoundedIcon fontSize="large" />
                    </IconButton>
                    <Avatar
                        sx={{
                            m: 1,
                            bgcolor: "primary.main",
                            width: 100,
                            height: 100,
                        }}
                    >
                        LB
                    </Avatar>
                    <IconButton aria-label="select right image">
                        <ArrowRightRoundedIcon fontSize="large" />
                    </IconButton>
                </Stack>

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        marginTop: 2,
                    }}
                >
                    <Box justifyContent="flex-start" width="inherit">
                        <Typography variant="h5">Username</Typography>
                        <TextField
                            fullWidth
                            error={!validUsername && username ? true : false}
                            id="editUsername"
                            label="New Username"
                            name="editUsername"
                            autoComplete="off"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            sx={{ mt: 1 }}
                        />

                        <Divider sx={{ m: 3, borderBottomWidth: "thick" }} />

                        <Typography variant="h5">Password</Typography>
                        <TextField
                            fullWidth
                            name="oldPassword"
                            label="Old Password"
                            type="password"
                            id="oldPassword"
                            autoComplete="off"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            fullWidth
                            error={!validPassword && password ? true : false}
                            name="newPassword"
                            label="New Password"
                            type="password"
                            id="newPassword"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                        <TextField
                            fullWidth
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
                            sx={{ mt: 1 }}
                        />

                        <Divider sx={{ m: 3, borderBottomWidth: "thick" }} />

                        <Typography variant="h5">Email Address</Typography>
                        <TextField
                            fullWidth
                            error={!validEmail && email ? true : false}
                            id="editEmail"
                            label="New Email"
                            name="editEmail"
                            autoComplete="email"
                            value={email}
                            disabled
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mt: 1 }}
                        />
                    </Box>
                </Box>

                <Button
                    sx={{ width: "100%", height: "50px", marginTop: 3 }}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    aria-label="Save Changes"
                    onClick={handleEditProfile}
                >
                    Save changes
                </Button>
            </Box>
        </>
    );
};

export default EditUserProfile;
