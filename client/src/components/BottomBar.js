import {
    Box,
    styled,
    Stack,
    Typography,
    IconButton,
    Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import DashboardMenu from "./DashboardMenu";
import useAuth from "../hooks/useAuth";
import UserPicture from "./UserPicture";
import { BACKEND_NEW_NOTIFICATIONS_ENDPOINT } from "../api/backend_endpoints";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useSocket from "../hooks/useSocket";
import { useNavigate } from "react-router-dom";

const BottomBar = () => {
    const [anchorElement, setAnchorElement] = useState(null);
    const { auth } = useAuth();
    const open = Boolean(anchorElement);
    const axiosPrivate = useAxiosPrivate();
    const { socket } = useSocket();
    const navigate = useNavigate();

    const [newNotifications, setNewNotifications] = useState(false);

    const PulsingButton = styled(NotificationsActiveIcon)(({ theme }) => ({
        fontSize: 50,
        border: "3px solid",
        borderColor: "text.secondary",
        color: theme.palette.button.pulsing,
        borderRadius: "50%",
        padding: "5px",
        animation: "pulse-animation 2s infinite",
        boxShadow: "0px 0px 1px 1px #0000001a",

        "@keyframes pulse-animation": {
            "0%": {
                boxShadow: "0 0 0 0px " + theme.palette.button.pulsing,
            },
            "100%": {
                boxShadow: "0 0 0 15px transparent",
            },
        },
    }));

    const handleMenuOpening = (event) => {
        setAnchorElement(event.currentTarget);
    };

    useEffect(() => {
        const update = async () => {
            try {
                const response = await axiosPrivate.get(
                    BACKEND_NEW_NOTIFICATIONS_ENDPOINT
                );
                setNewNotifications(response.data.newNotification);
            } catch (error) {
                console.log(error);
            }
        };

        socket.onAny((eventName, args) => {
            update();
        });

        update();
    }, [socket]);

    return (
        <>
            <Box
                width="100%"
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "40px",
                    marginBottom: "25px",
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-around"
                    width="inherit"
                    spacing={5}
                >
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <UserPicture size="72px" userPic={auth.profilePicID} />

                        <Typography color="text.primary" variant="h6">
                            {auth.username}
                        </Typography>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        <IconButton
                            onClick={(e) => handleMenuOpening(e)}
                            aria-label="Open menu"
                            sx={{ padding: 0 }}
                        >
                            <Stack align={"column"} alignItems={"center"}>
                                <MenuRoundedIcon
                                    sx={{
                                        fontSize: 50,
                                        border: "3px solid",
                                        borderColor: "palette.text.secondary",
                                        borderRadius: "50%",
                                        padding: "3px",
                                    }}
                                />

                                <Typography
                                    color="text.primary"
                                    fontSize={"14px"}
                                    mt={0.2}
                                >
                                    Main Menu
                                </Typography>
                            </Stack>
                        </IconButton>
                        <IconButton
                            onClick={() => navigate("/notifications")}
                            aria-label="Open menu"
                            sx={{ padding: 0 }}
                        >
                            <Stack align={"column"} alignItems={"center"}>
                                {newNotifications ? (
                                    <PulsingButton />
                                ) : (
                                    <NotificationsNoneIcon
                                        sx={{
                                            fontSize: 50,
                                            border: "3px solid",
                                            borderColor:
                                                "palette.text.secondary",
                                            borderRadius: "50%",
                                            padding: "3px",
                                        }}
                                    />
                                )}
                                <Typography
                                    color="text.primary"
                                    fontSize={"14px"}
                                    mt={0.2}
                                >
                                    Notifications
                                </Typography>
                            </Stack>
                        </IconButton>
                    </Stack>
                </Stack>
                <DashboardMenu
                    anchorEl={anchorElement}
                    setAnchorEl={setAnchorElement}
                    open={open}
                />
            </Box>
        </>
    );
};

export default BottomBar;
