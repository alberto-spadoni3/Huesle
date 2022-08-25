import {
    Box,
    styled,
    Stack,
    Typography,
    IconButton,
} from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
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

    const MenuTooltip = styled(({ className, ...props }) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: theme.palette.tooltip.main,
            color: theme.palette.text.secondary,
            fontSize: 16,
        },
    }));

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
                    <UserPicture userPic={auth.profilePicID} />
                    <Typography color="text.primary" variant="h6" pl={"6px"}>
                        {auth.username}
                    </Typography>
                    <IconButton
                        onClick={(e) => handleMenuOpening(e)}
                        aria-label="Open menu"
                    >
                        <MenuRoundedIcon
                            sx={{
                                fontSize: 50,
                                border: "3px solid",
                                borderColor: newNotifications? "button.main": "palette.text.secondary",
                                borderRadius: "50%",
                                padding: "5px",
                                animation:"wave"
                            }}
                        />
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
