import {
    Avatar,
    Box,
    Stack,
    Typography,
    Button,
    AvatarGroup,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import useGameData from "../hooks/useGameData";
import useAuth from "../hooks/useAuth";

const Match = () => {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const { loadBoard, players, attempts } = useGameData();

    useEffect(() => {
        loadBoard();
    }, []);

    const Player = ({ name = "", reverse, hideLabel }) => {
        return (
            <Stack
                sx={{ width: "fit-content" }}
                direction={reverse ? "row-reverse" : "row"}
                alignItems="center"
                spacing={2}
            >
                <Avatar sx={{ width: 64, height: 64 }}>
                    {/* // TODO - here we should put the user's picture */}
                    {name.substring(0, 2).toUpperCase()}
                </Avatar>
                {!hideLabel && <Typography variant="h5">{name}</Typography>}
            </Stack>
        );
    };

    const Hint = ({ hintType }) => {
        const hintColor =
            hintType === "C" ? "khaki" : hintType === "P" ? "lightgreen" : "";
        return <Avatar sx={{ bgcolor: hintColor }}>{hintType}</Avatar>;
    };

    const Attempt = ({ attempt }) => {
        return (
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                marginBottom={2}
            >
                <Player name={attempt.playerName} hideLabel />
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
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Typography variant="h4" align="center">
                    Match details
                </Typography>

                {players.length > 0 && (
                    <>
                        <Stack alignItems="center" marginY={4}>
                            <Player
                                name={players.find(
                                    (player) => player === auth.username
                                )}
                            />
                            <Typography variant="h2" margin="5px 0">
                                VS
                            </Typography>
                            <Player
                                name={players.find(
                                    (player) => player !== auth.username
                                )}
                                reverse
                            />
                        </Stack>

                        <Typography variant="h4">Attempts</Typography>
                        {attempts.length > 0 ? (
                            attempts.map((item, index) => (
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    marginY={1}
                                    key={index}
                                >
                                    <Typography variant="h6">
                                        {index + 1 + ")"}
                                    </Typography>
                                    <Attempt attempt={item} />
                                </Stack>
                            ))
                        ) : (
                            <Typography variant="h6">
                                No attempts has been made so far.
                            </Typography>
                        )}
                    </>
                )}

                <Button
                    sx={{
                        width: "100%",
                        height: "50px",
                        marginTop: 2,
                        marginBottom: 2,
                    }}
                    variant="contained"
                    color="button"
                    startIcon={<SportsEsportsIcon />}
                    aria-label="Play"
                    onClick={() => navigate("/gameboard")}
                >
                    Play
                </Button>
            </Box>
        </>
    );
};

export default Match;
