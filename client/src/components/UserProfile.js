import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import BackButton from "./BackButton";
import { Box, Typography, Stack, Button, Fade } from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    BACKEND_GET_USER_STATS_ENDPOINT,
    BACKEND_DELETE_USER_ENDPOINT,
} from "../api/backend_endpoints";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import UserPicture from "./UserPicture";
import { useSnackbar } from "notistack";
import ConfirmationDialog from "./ConfirmationDialog";

const UserProfile = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { enqueueSnackbar } = useSnackbar();
    const { auth } = useAuth();
    const logout = useLogout();
    const [deleteAccountDialogStatus, setDeleteAccountDialogStatus] =
        useState(false);

    const StatisticsCard = styled(Box)(({ theme }) => ({
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        border: "2px solid",
        borderColor: theme.palette.text.secondary,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        margin: "1rem 0",
    }));

    const [stats, setStats] = useState({
        matches_won: 0,
        matches_lost: 0,
        matches_drawn: 0,
    });

    useEffect(() => {
        try {
            const response = axiosPrivate.get(BACKEND_GET_USER_STATS_ENDPOINT);
            response.then((response) => {
                if (response.status === 200) {
                    setStats(response.data);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    return (
        <>
            <BackButton />
            <Fade in={true}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <UserPicture size={128} userPic={auth.profilePicID} />

                    <Typography color="text.primary" variant="h4" mt={1}>
                        {auth.username}
                    </Typography>
                    <Typography variant="h7" mb={2}>
                        {`(${auth.email})`}
                    </Typography>

                    <StatisticsCard>
                        <Stack margin={1}>
                            <Typography
                                color="text.primary"
                                variant="h5"
                                mb={1}
                            >
                                User statistics
                            </Typography>
                            <Typography variant="body1">
                                Matches won: {stats.matches_won}
                            </Typography>
                            <Typography variant="body1">
                                Matches lost: {stats.matches_lost}
                            </Typography>
                            <Typography variant="body1">
                                Matches drawns: {stats.matches_drawn}
                            </Typography>
                        </Stack>
                    </StatisticsCard>
                    <Button
                        sx={{ width: "100%", mb: 3.5 }}
                        variant="contained"
                        color="button"
                        startIcon={<EditIcon />}
                        aria-label="Edit Profile"
                        onClick={(e) => navigate("/user/editProfile")}
                    >
                        Edit profile
                    </Button>
                    <Stack spacing={1.5} width="100%">
                        <Button
                            sx={{ width: "100%" }}
                            variant="contained"
                            color="error"
                            startIcon={<LogoutIcon />}
                            aria-label="Logout"
                            onClick={logout}
                        >
                            Logout
                        </Button>
                        <Button
                            sx={{ width: "100%" }}
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            aria-label="Delete account"
                            onClick={() => setDeleteAccountDialogStatus(true)}
                        >
                            Delete account
                        </Button>
                    </Stack>
                    <ConfirmationDialog
                        openStatus={deleteAccountDialogStatus}
                        setOpenStatus={setDeleteAccountDialogStatus}
                        title={"Delete Account"}
                        message={
                            "Are you sure you want to delete your account?" +
                            " All your data will be lost forever!"
                        }
                        callbackOnYes={async () => {
                            try {
                                const response = await axiosPrivate.delete(
                                    BACKEND_DELETE_USER_ENDPOINT
                                );
                                if (response.status === 200) {
                                    enqueueSnackbar(response.data.message, {
                                        variant: "success",
                                    });
                                    await logout();
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    />
                </Box>
            </Fade>
        </>
    );
};

export default UserProfile;
