import SaveIcon from "@mui/icons-material/Save";
import { TextField, Typography, Box, Button, Divider } from "@mui/material";
import BackButton from "./BackButton";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import {
    BACKEND_UPDATE_EMAIL,
    BACKEND_UPDATE_USERNAME,
    BACKEND_UPDATE_PASSWORD_ENDPOINT,
} from "../api/backend_endpoints";
import UserPictureSelector from "./UserPictureSelector";
import useRefreshToken from "../hooks/useRefreshToken";

const EMAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const EditUserProfile = () => {
    const { auth, setAuth } = useAuth();
    const refresh = useRefreshToken();
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();

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
        const emailPresentAndValid = email.trim() !== "" && validEmail;
        const usernamePresentAndValid = username.trim() !== "" && validUsername;
        const passwordPresentAndValid =
            password.trim() !== "" && validPassword && validMatchPassword;

        if (emailPresentAndValid) {
            try {
                const response = await axiosPrivate.post(
                    BACKEND_UPDATE_EMAIL,
                    JSON.stringify({ newEmail: email })
                );

                if (response.status === 200) {
                    console.log("Email updated");
                    setEmail("");
                    enqueueSnackbar(response.data.message, {
                        variant: "success",
                    });
                }
            } catch (error) {
                if (!error?.response) {
                    console.log("No Server Response");
                    enqueueSnackbar("No Server Response", { variant: "info" });
                } else if (error.response?.status === 409) {
                    console.log(error.response?.data?.message);
                    enqueueSnackbar(error.response?.data?.message, {
                        variant: "warning",
                    });
                } else {
                    console.log("Username update failed");
                    enqueueSnackbar("Username update failed", {
                        variant: "error",
                    });
                }
            }
        }

        // update username if present
        if (usernamePresentAndValid) {
            try {
                const response = await axiosPrivate.post(
                    BACKEND_UPDATE_USERNAME,
                    JSON.stringify({ newUsername })
                );

                if (response.status === 200) {
                    console.log("username updated");
                    setUsername("");
                    enqueueSnackbar(response.data.message, {
                        variant: "success",
                    });
                }
            } catch (error) {
                if (!error?.response) {
                    console.log("No Server Response");
                    enqueueSnackbar("Username updated", { variant: "info" });
                } else if (error.response?.status === 409) {
                    console.log(error.response?.data?.message);
                    enqueueSnackbar(error.response?.data?.message, {
                        variant: "warning",
                    });
                } else {
                    console.log("Username update failed");
                    enqueueSnackbar("Username update failed", {
                        variant: "error",
                    });
                }
            }
        }

        if (passwordPresentAndValid) {
            try {
                const response = await axiosPrivate.post(
                    BACKEND_UPDATE_PASSWORD_ENDPOINT,
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
                    console.log("password updated");
                    enqueueSnackbar("Password updated successfully", {
                        variant: "success",
                    });
                    setOldPassword("");
                    setPassword("");
                    setMatchPassword("");
                }
            } catch (error) {
                if (!error?.response) {
                    console.log("No Server Response");
                    enqueueSnackbar("No Server Response", { variant: "info" });
                } else if (error.response?.status === 400) {
                    console.log(error.response?.data?.message);
                    enqueueSnackbar(error.response?.data?.message, {
                        variant: "error",
                    });
                } else if (error.response?.status === 401) {
                    console.log("Username not found in the database");
                    enqueueSnackbar(
                        "Your current username not found in the database",
                        {
                            variant: "warning",
                        }
                    );
                } else {
                    console.log("Password update Failed");
                    enqueueSnackbar("Password update Failed", {
                        variant: "error",
                    });
                }
            }
        }

        if (emailPresentAndValid || usernamePresentAndValid) await refresh();
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
                <UserPictureSelector />

                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "flex-start",
                        marginTop: 2,
                    }}
                >
                    <Box justifyContent="flex-start" width="inherit">
                        <Typography color="text.primary" variant="h5">
                            Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            error={!validEmail && email ? true : false}
                            id="editEmail"
                            label="New Email"
                            name="editEmail"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{ mt: 1 }}
                        />

                        <Divider sx={{ m: 3, borderBottomWidth: "thick" }} />

                        <Typography color="text.primary" variant="h5">
                            Username
                        </Typography>
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

                        <Typography color="text.primary" variant="h5">
                            Password
                        </Typography>
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
                    </Box>
                </Box>

                <Button
                    sx={{
                        width: "100%",
                        height: "50px",
                        margin: "24px 0 24px 0",
                    }}
                    variant="contained"
                    startIcon={<SaveIcon />}
                    aria-label="Save Changes"
                    color="button"
                    onClick={handleEditProfile}
                >
                    Save changes
                </Button>
            </Box>
        </>
    );
};

export default EditUserProfile;
