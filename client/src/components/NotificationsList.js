import {
    Box,
    Button,
    Fade,
    styled,
    TableCell,
    TableContainer,
    TableRow,
    Table,
    TableBody,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BACKEND_NOTIFICATIONS_ENDPOINT } from "../api/backend_endpoints";
import useGameData from "../hooks/useGameData";
import useSocket from "../hooks/useSocket";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import BackButton from "./BackButton";

const NotificationsList = () => {
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const { loadBoard } = useGameData();

    const { socket } = useSocket();

    const NotificationsCards = styled(Box)(({ theme }) => ({
        width: "100%",
        backgroundColor: theme.palette.background.paper,
        borderRadius: 5,
        marginTop: "15px",
        border: "3px solid",
        borderColor: theme.palette.background.paper,
    }));

    const [notifications, setNotifications] = useState([]);

    async function updateNotifications() {
        try {
            const response = await axiosPrivate.get(
                BACKEND_NOTIFICATIONS_ENDPOINT
            );
            const { notifications } = response.data;
            setNotifications(notifications);
        } catch (error) {
            console.log(error);
        }

        try {
            const date = new Date();
            await axiosPrivate.post(
                BACKEND_NOTIFICATIONS_ENDPOINT,
                JSON.stringify({ date })
            );
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        socket.onAny((eventName, args) => {
            updateNotifications();
        });

        updateNotifications();
    }, [socket]);

    function generateRow(index, date, matchId, message, read) {
        let bgcolor;
        if (!read) {
            bgcolor = "background.border";
        } else {
            bgcolor = "background.paper";
        }
        const formatDate = new Date(date);
        return (
            <TableRow
                key={index}
                onClick={() => openSelectedMatch(matchId)}
                sx={{ bgcolor: bgcolor }}
            >
                <TableCell component="th" scope="row" align="center">
                    <Typography
                        color="text.primary"
                        variant="subtitle2"
                        sx={{
                            borderRadius: 5,
                            border: "1px solid",
                            borderColor: "text.primary",
                            width: "40%",
                        }}
                    >
                        {formatDate.getDate() +
                            "-" +
                            (formatDate.getMonth() + 1) +
                            "-" +
                            formatDate.getFullYear()}
                    </Typography>
                    <Typography
                        color="text.primary"
                        variant="body2"
                        textAlign="justify"
                        mt={1}
                    >
                        {message}
                    </Typography>
                </TableCell>
                <TableCell component="th" scope="row" align="center">
                    <Button
                        sx={{
                            width: "70%",
                            height: "50%",
                            fontSize: "65%",
                            color: "text.secondary",
                        }}
                        variant="outlined"
                        aria-label="Go to Match"
                    >
                        Go to Match
                    </Button>
                </TableCell>
            </TableRow>
        );
    }

    async function openSelectedMatch(matchId) {
        if (!matchId) {
            console.log("Invalid match ID");
            return;
        }

        try {
            loadBoard(matchId).then(() =>
                navigate("/match-details", { replace: true })
            );
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <BackButton />
            <Fade in={true} style={{ transitionDelay: "30ms" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Typography
                        color="text.primary"
                        variant="h5"
                        align="center"
                    >
                        Notifications
                    </Typography>
                    <NotificationsCards>
                        {notifications.length > 0 ? (
                            <TableContainer>
                                <Table
                                    sx={{
                                        minWidth: 250,
                                    }}
                                    aria-label="Active Matches table"
                                >
                                    <TableBody>
                                        {notifications.map((row, index) =>
                                            generateRow(
                                                index,
                                                row.date,
                                                row.matchId,
                                                row.message,
                                                row.read
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <Typography variant="h7" marginLeft={1}>
                                No notifications
                            </Typography>
                        )}
                    </NotificationsCards>
                </Box>
            </Fade>
        </>
    );
};

export default NotificationsList;
