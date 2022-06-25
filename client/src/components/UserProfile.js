import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useLogout from "../hooks/useLogout";
import BackButton from "./BackButton";
import { Box, Avatar, Typography, Stack, Button } from "@mui/material";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";

const UserProfile = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const logout = useLogout();

    const handleLogout = async () => {
        await logout();
        navigate("/");
    };

    const StatisticsCard = styled(Box)(({ theme }) => ({
        width: "90%",
        backgroundColor: "black",
        borderRadius: 5,
        display: "flex",
        justifyContent: "center",
        margin: "1rem 0",
    }));

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
                    <AccountCircleRoundedIcon fontSize="large" />
                </Avatar>
                <Typography variant="h5">{auth.username}</Typography>
                <StatisticsCard>
                    <Stack>
                        <Typography variant="h6" textAlign="center">
                            Stats
                        </Typography>
                        <Typography variant="body2">Matches won: 0</Typography>
                        <Typography variant="body2">Matches lost: 0</Typography>
                        <Typography variant="body2">
                            Matches abandoned: 0
                        </Typography>
                    </Stack>
                </StatisticsCard>
                <Button
                    sx={{ width: "100%", mb: 2 }}
                    variant="contained"
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
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            </Box>
        </>
    );
};

export default UserProfile;
