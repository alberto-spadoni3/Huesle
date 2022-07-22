import {
    Avatar,
    Box,
    Stack,
    Typography,
    Button,
    AvatarGroup,
} from "@mui/material";
import React from "react";
import BackButton from "./BackButton";
import { useNavigate } from "react-router-dom";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";

const Match = () => {
    const navigate = useNavigate();
    // temporary variables that are going to be replaced by an HTTP call to the backend
    const player1 = "albisyx";
    const player2 = "azzu";

    const attemptsSoFar = [
        { player: player1, attempt: "C" },
        { player: player2, attempt: "" },
        { player: player1, attempt: "P P C" },
        { player: player2, attempt: "P P C C" },
        { player: player1, attempt: "P P P C" },
    ];

    const Player = ({ name, reverse, hideLabel }) => {
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

    const Attempt = ({ player, attempt }) => {
        return (
            <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                marginBottom={2}
            >
                <Player name={player} hideLabel />
                <AvatarGroup max={4}>
                    {attempt.split(" ").map((hint, index) => {
                        const hintColor =
                            hint === "C"
                                ? "khaki"
                                : hint === "P"
                                ? "lightgreen"
                                : "";
                        return (
                            hint && (
                                <Avatar key={index} sx={{ bgcolor: hintColor }}>
                                    {hint}
                                </Avatar>
                            )
                        );
                    })}
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
                <Stack alignItems="center" marginY={4}>
                    <Player name={player1} />
                    <Typography variant="h2" margin="5px 0">
                        VS
                    </Typography>
                    <Player name={player2} reverse />
                </Stack>

                <Typography variant="h4">Attempts</Typography>
                {attemptsSoFar.map((item, index) => (
                    <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        marginY={1}
                        key={index}
                    >
                        <Typography variant="h6">{index + 1 + ")"}</Typography>
                        <Attempt player={item.player} attempt={item.attempt} />
                    </Stack>
                ))}

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
