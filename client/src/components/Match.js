import {
    Avatar,
    Box,
    Stack,
    Typography,
    Button,
    AvatarGroup,
    Fade,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import useGameData from "../hooks/useGameData";
import useAuth from "../hooks/useAuth";
import BottomBar from "./BottomBar";
import UserPicture from "./UserPicture";
import ConfirmationDialog from "./ConfirmationDialog";
import {BACKEND_LEAVE_MATCH_ENDPOINT} from "../api/backend_endpoints";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Match = () => {
    const {
        id,
        loadBoard,
        players,
        profilePics,
        attempts,
        status,
        isMatchOver,
        GameStates,
    } = useGameData();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [leaveMatchDialogStatus, setLeaveMatchDialogStatus] = useState(false);
    const axiosPrivate = useAxiosPrivate();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        loadBoard().then(() => setLoading(false));
    }, []);

    const Player = ({ name = "", reverse, hideLabel }) => {
        return (
            <Stack
                sx={{ width: "fit-content" }}
                direction={reverse ? "row-reverse" : "row"}
                alignItems="center"
                spacing={2}
            >
                <UserPicture
                    size={80}
                    userPic={
                        profilePics.find((p) => p.username === name)?.picId
                    }
                />
                {!hideLabel && <Typography variant="h6">{name}</Typography>}
            </Stack>
        );
    };

    const Hint = ({ hintType }) => {
        const hintColor =
            hintType === "C"
                ? "gameboard.color"
                : hintType === "P"
                ? "gameboard.position"
                : "";
        return (
            <Avatar
                sx={{
                    bgcolor: hintColor,
                    color: "black",
                    border: "black",
                }}
            >
                {hintType}
            </Avatar>
        );
    };

    const Attempt = ({ attempt }) => {
        return (
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                marginBottom={2}
            >
                <UserPicture
                    size={50}
                    userPic={
                        profilePics.find(
                            (p) => p.username === attempt.playerName
                        )?.picId
                    }
                />
                <AvatarGroup max={4}>
                    {Array(attempt.rightPositions)
                        .fill()
                        .map((_, index) => (
                            <Hint key={index} hintType="P" />
                        ))}

                    {Array(attempt.rightColours)
                        .fill()
                        .map((_, index) => (
                            <Hint key={index} hintType="C" />
                        ))}
                </AvatarGroup>
            </Stack>
        );
    };

    return (
        <>
            <BackButton />
            <Fade in={!loading} style={{ transitionDelay: "30ms" }}>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <Typography
                        color="text.primary"
                        variant="h4"
                        align="center"
                    >
                        Match details
                    </Typography>

                    {players.length > 0 && (
                        <>
                            <Stack alignItems="center" marginY={4}>
                                <Player name={auth.username} />
                                <Typography
                                    variant="h3"
                                    color="text.primary"
                                    margin="5px 0"
                                >
                                    VS
                                </Typography>
                                <Player
                                    name={players.find(
                                        (player) => player !== auth.username
                                    )}
                                    reverse
                                />
                            </Stack>

                            <Typography color="text.primary" variant="h6">
                                Attempts
                            </Typography>
                            {attempts.length > 0 ? (
                                attempts.map((item, index) => (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        marginY={1}
                                        key={index}
                                    >
                                        <Typography variant="h7">
                                            {index + 1 + " ·"}
                                        </Typography>
                                        <Attempt attempt={item} />
                                    </Stack>
                                ))
                            ) : (
                                <Typography variant="body1">
                                    No attempts has been made so far.
                                </Typography>
                            )}
                        </>
                    )}
                    {isMatchOver() && (
                        <Typography
                            variant="h5"
                            align="center"
                            sx={{
                                marginTop: 2,
                            }}
                        >
                            {status.state === GameStates.WINNER
                                ? status.abandoned
                                    ? (status.player === auth.username
                                          ? players
                                                .find(
                                                    (p) => p !== auth.username
                                                )
                                                .split(" ")[0]
                                          : "You") +
                                      " left the game and admitted defeat"
                                    : status.player === auth.username
                                    ? "You won!"
                                    : "You lost..."
                                : "The match ended in a draw"}
                        </Typography>
                    )}
                    <Button
                        sx={{
                            width: "100%",
                            height: "50px",
                            marginTop: 2,
                        }}
                        variant="contained"
                        color="button"
                        startIcon={<SportsEsportsIcon />}
                        aria-label={!isMatchOver() ? "Play" : "Show game board"}
                        onClick={() => navigate("/gameboard")}
                    >
                        {!isMatchOver() ? "Play" : "Show game board"}
                    </Button>
                    {!isMatchOver() && (
                        <Button
                            sx={{
                                width: "100%",
                                height: "40px",
                                marginTop: 2,
                            }}
                            variant="outlined"
                            color="error"
                            startIcon={<OutlinedFlagIcon />}
                            aria-label="Leave Match"
                            onClick={() => setLeaveMatchDialogStatus(true)}
                        >
                            Leave Match
                        </Button>
                    )}
                    <ConfirmationDialog
                        openStatus={leaveMatchDialogStatus}
                        setOpenStatus={setLeaveMatchDialogStatus}
                        title={"Abandon Match"}
                        message={"Are you sure you want to admit defeat to " + players.find(p => p != auth.username) + "?"}
                        callbackOnYes={async () => {
                            try {
                                await axiosPrivate.put(
                                    BACKEND_LEAVE_MATCH_ENDPOINT,
                                    {
                                        matchId: id
                                    }
                                );
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    />
                    {/* FOOTER */}
                    <BottomBar></BottomBar>
                </Box>
            </Fade>
        </>
    );
};

export default Match;
