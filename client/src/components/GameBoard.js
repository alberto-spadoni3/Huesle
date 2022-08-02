import { Box, Stack, Button } from "@mui/material";
import BackButton from "./BackButton";
import DecodeRow from "./DecodeRow";
import ColorSelector from "./ColorSelector";
import useGameData from "../hooks/useGameData";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { axiosPrivate } from "../api/axios";
import {
    BACKEND_DO_GUESS_ENDPOINT,
    BACKEND_SETTINGS_ENDPOINT,
} from "../api/backend_endpoints";
import useAuth from "../hooks/useAuth";

const GameBoard = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { auth } = useAuth();

    const {
        currentPegsColor,
        setCurrentPegsColor,
        id,
        colorblindMode,
        setColorblindMode,
        attempts,
        loadBoard,
        swapColors,
        updateMatch,
        isItActivePlayer,
        NUMBER_OF_ATTEMPTS,
        PEGS_PER_ROW,
    } = useGameData();

    const loadUserSettings = async () => {
        try {
            const response = await axiosPrivate.get(BACKEND_SETTINGS_ENDPOINT);
            if (response.status === 200) {
                setColorblindMode(response?.data?.colorblindMode);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadBoard();
        loadUserSettings();
    }, []);

    const handleSubmitRow = async () => {
        if (currentPegsColor.size !== 4) {
            enqueueSnackbar(
                `Complete a row with all the ${PEGS_PER_ROW} colors before submitting the attempt`,
                { variant: "info", autoHideDuration: 3000 }
            );
            return;
        }

        try {
            const username = auth.username;

            const colorSequence = [];
            for (let i = 0; i < PEGS_PER_ROW; i++) {
                colorSequence.push(currentPegsColor.get(i));
            }

            const sequence = colorblindMode
                ? swapColors(colorSequence)
                : colorSequence;

            const response = await axiosPrivate.put(BACKEND_DO_GUESS_ENDPOINT, {
                matchId: id,
                sequence,
            });

            const { status, rightC, rightP } = response.data;
            const newAttempt = {
                sequence: sequence,
                player: auth.username,
                rightColours: rightC,
                rightPositions: rightP,
            };
            updateMatch(status, newAttempt);
            setCurrentPegsColor(new Map());
            //loadBoard();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <BackButton />

            <Box
                sx={{
                    border: "3px ridge",
                    borderColor: "palette.text.primary",
                    borderRadius: "10px",
                    backgroundColor: "rgb(96,56,31)",
                    marginBottom: 1,
                    paddingY: "5px",
                }}
            >
                <Stack
                    direction="column-reverse"
                    alignItems="center"
                    spacing={1}
                >
                    {Array(NUMBER_OF_ATTEMPTS)
                        .fill()
                        .map((_, index) => (
                            <DecodeRow key={index} rowID={index} />
                        ))}
                </Stack>
            </Box>

            <Box
                sx={{
                    border: "3px groove",
                    borderColor: "palette.text.primary",
                    borderRadius: "10px",
                    backgroundColor: "#1a1a1a",
                    padding: "5px",
                    marginBottom: 2,
                }}
            >
                <ColorSelector />
                <Button
                    sx={{
                        width: "100%",
                        border: "1px solid white",
                        borderRadius: "5px",
                    }}
                    disabled={
                        attempts.length === NUMBER_OF_ATTEMPTS ||
                        !isItActivePlayer()
                    }
                    variant="contained"
                    color="neutral"
                    onClick={handleSubmitRow}
                >
                    Send Attempt
                </Button>
            </Box>
            <div style={{ height: "8px" }}></div>
        </>
    );
};

export default GameBoard;
