import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import BackButton from "./BackButton";
import {Box, Avatar, Typography, Stack, Button, Fade} from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import {axiosPrivate} from "../api/axios";
import {BACKEND_GET_USER_STATS_ENDPOINT, BACKEND_SETTINGS_ENDPOINT} from "../api/backend_endpoints";
import {useEffect, useState} from "react";

const UserProfile = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const logout = useLogout();

    const StatisticsCard = styled(Box)(({ theme }) => ({
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        margin: "1rem 0",
    }));

    const [stats, setStats] = useState({matches_won: 0, matches_lost: 0, matches_drawn: 0})

    useEffect(() => {
        try {
            const response = axiosPrivate.get(BACKEND_GET_USER_STATS_ENDPOINT);
            response.then(() => {
                console.log(response.data);
                if (response.status === 200) {
                    setStats(response.data)
                }
            })
        } catch (error) {
            console.log(error);
        }
    }, [])

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
                <Avatar
                    sx={{
                        m: 1,
                        bgcolor: "primary.main",
                        width: 64,
                        height: 64,
                    }}
                >
                    <AccountCircleRoundedIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5">{auth.username}</Typography>
                <StatisticsCard>
                    <Stack>
                        <Typography variant="h6" textAlign="center">
                            Stats
                        </Typography>
                        <Typography variant="body2">Matches won: {stats.matches_won}</Typography>
                        <Typography variant="body2">Matches lost: {stats.matches_lost}</Typography>
                        <Typography variant="body2">
                            Matches drawns: {stats.matches_drawn}
                        </Typography>
                    </Stack>
                </StatisticsCard>
                <Button
                    sx={{ width: "100%", mb: 2 }}
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    aria-label="Edit Profile"
                    onClick={(e) => navigate("/user/editProfile")}
                >
                    Edit profile
                </Button>
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
            </Box>
            </Fade>
        </>
    );
};

export default UserProfile;
