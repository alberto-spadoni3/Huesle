import {
    Box,
    styled,
    Stack,
    Typography,
    IconButton, Badge,
} from "@mui/material";
import {useEffect, useState} from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import DashboardMenu from "./DashboardMenu";
import useAuth from "../hooks/useAuth";
import UserPicture from "./UserPicture";
import {BACKEND_NEW_NOTIFICATIONS_ENDPOINT} from "../api/backend_endpoints";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useSocket from "../hooks/useSocket";

const BottomBar = () => {
    const [anchorElement, setAnchorElement] = useState(null);
    const { auth } = useAuth();
    const open = Boolean(anchorElement);
    const axiosPrivate = useAxiosPrivate();
    const { socket} = useSocket();

    const [newNotifications, setNewNotifications] = useState(false);

    const PulsingButton = styled(MenuRoundedIcon)(({ theme }) => ({
        fontSize: 50,
        border: "3px solid",
        borderColor: "text.secondary",
        borderRadius: "50%",
        padding: "5px",
        animation: "pulse-animation 2s infinite",
        boxShadow: "0px 0px 1px 1px #0000001a",

        '@keyframes pulse-animation': {
            '0%': {
                boxShadow: "0 0 0 0px " + theme.palette.button.pulsing,
            },
            '100%': {
                boxShadow: "0 0 0 15px transparent",
            },
        }
    }));


    const handleMenuOpening = (event) => {
        setAnchorElement(event.currentTarget);
    };

    useEffect(() => {
        const update = async () => {
            try {
                const response = await axiosPrivate.get(
                    BACKEND_NEW_NOTIFICATIONS_ENDPOINT
                )
                setNewNotifications(response.data.newNotification);
            } catch (error) {
                console.log(error);
            }
        }

        socket.onAny((eventName, args) => {
            update();
        });

        update();
    }, [socket])

    return (
        <>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    marginY: "25px",
                }}
            >
                <Stack
                    direction="row"
                    justifyContent="space-evenly"
                    alignItems="center"
                    width="inherit"
                    spacing={4}
                >
                    <UserPicture userPic={auth.profilePicID}/>
                    <Typography color="text.primary" variant="h6" pl={"6px"}>
                        {auth.username}
                    </Typography>
                    <IconButton
                        onClick={(e) => handleMenuOpening(e)}
                        aria-label="Open menu"
                        flexDirection="column"
                    >
                        {newNotifications?
                            (<PulsingButton/>) :
                            (<MenuRoundedIcon
                                    sx={{
                                        fontSize: 50,
                                        border: "3px solid",
                                        borderColor: "palette.text.secondary",
                                        borderRadius: "50%",
                                        padding: "5px",}}
                                />
                            )}
                    </IconButton>
                </Stack>
                <DashboardMenu
                    anchorEl={anchorElement}
                    setAnchorEl={setAnchorElement}
                    open={open}
                    newNotifications={newNotifications}
                />
            </Box>
        </>
    );
};

export default BottomBar;
