import { Box, Stack, Button } from "@mui/material";
import BackButton from "./BackButton";
import DecodeRow from "./DecodeRow";
import ColorSelector from "./ColorSelector";
import useGameData from "../hooks/useGameData";
import {useEffect} from "react";
import { useSnackbar } from "notistack";
import {axiosPrivate} from "../api/axios";
import {
    BACKEND_DO_GUESS_ENDPOINT,
    BACKEND_GET_MATCH_ENDPOINT,
} from "../api/backend_endpoints";
import useAuth from "../hooks/useAuth";
import {socket} from "../App";

const GameBoard = () => {
    const { enqueueSnackbar } = useSnackbar();
    const { auth, MessageTypes } = useAuth();
    const matchId = "62e10f29b4902320dced6538";

    const {
        currentPegsColor,
        setCurrentPegsColor,
        currentRow,
        setCurrentRow,
        setMatchHistory,
        isItActivePlayer,
        setStatus,
        NUMBER_OF_ATTEMPTS,
        PEGS_PER_ROW,
    } = useGameData();

    let flag = true;

    useEffect(() => {
        loadBoard();
        flag = false;

    }, [flag])

    socket.on(MessageTypes.NOTIFICATION, data => {
        loadBoard();
    });

    function loadBoard() {
        const response = axiosPrivate.get(
            BACKEND_GET_MATCH_ENDPOINT,
            {params: {matchId: matchId}}
        );
        response.then(response => {
            const match = response.data.match;
            setCurrentRow(match.attempts.length);
            setStatus(match.status);
            setMatchHistory(match.attempts);
        })
    }

    const handleSubmitRow = async () => {
        if (currentPegsColor.size !== 4) {
            enqueueSnackbar(
                `Complete a row with all the ${PEGS_PER_ROW} colors before submitting the attempt`,
                { variant: "info", autoHideDuration: 3000 }
            );
            return;
        }

        const sequence = [];
        let temp = 0;
        while(temp < PEGS_PER_ROW) {
            sequence.push(currentPegsColor.get(temp));
            temp++;
        }

        try {
            const username = auth.username;
            const response = await axiosPrivate.put(
                BACKEND_DO_GUESS_ENDPOINT,
                {username, matchId, sequence}
            );

            const {status} = response.data;
            setStatus(status);
            setCurrentPegsColor(new Map());
            setCurrentRow((prevRow) => {
                return prevRow + 1;
            });
            loadBoard();
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
                    disabled={currentRow === NUMBER_OF_ATTEMPTS || !isItActivePlayer()}
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
