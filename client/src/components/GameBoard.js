import {Box, Stack, Button, Fade} from "@mui/material";
import BackButton from "./BackButton";
import DecodeRow from "./DecodeRow";
import ColorSelector from "./ColorSelector";
import useGameData from "../hooks/useGameData";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import {
    BACKEND_DO_GUESS_ENDPOINT,
    BACKEND_SETTINGS_ENDPOINT,
} from "../api/backend_endpoints";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const GameBoard = () => {
    const { enqueueSnackbar } = useSnackbar();
    const axiosPrivate = useAxiosPrivate()
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
            <Fade in={true}>
            <Box>
            <Box
                sx={{
                    border: "3px ridge",
                    borderColor: "text.primary",
                    borderRadius: "10px",
                    backgroundColor: "gameboard.background",
                    marginBottom: 1,
                    paddingY: "5px",
                    minWidth: "min-content"
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
                    borderColor: "text.primary",
                    borderRadius: "10px",
                    backgroundColor: "background.paper",
                    padding: "5px",
                    marginBottom: 2,
                    minWidth: "350px"
                }}
            >
                <ColorSelector />
                <Button
                    sx={{
                        width: "100%",
                        border: "1px solid",
                        borderColor: "text.primary",
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
            </Box>
            </Fade>
        </>
    );
};

export default GameBoard;
