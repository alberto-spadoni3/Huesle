import { Box, Stack, Button } from "@mui/material";
import BackButton from "./BackButton";
import DecodeRow from "./DecodeRow";
import ColorSelector from "./ColorSelector";
import useGameData from "../hooks/useGameData";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import {axiosPrivate} from "../api/axios";
import {
    BACKEND_DO_GUESS_ENDPOINT,
    BACKEND_GET_MATCH_ENDPOINT,
    BACKEND_GET_MATCHES_ENDPOINT
} from "../api/backend_endpoints";
import useAuth from "../hooks/useAuth";

const GameBoard = () => {
    const { enqueueSnackbar } = useSnackbar();
    const matchId = "62c6e93edd8d24de9a35f47f";

    const {
        currentPegsColor,
        setCurrentPegsColor,
        currentRow,
        setCurrentRow,
        setExactMatches,
        setColorMatches,
        NUMBER_OF_ATTEMPTS,
        PEGS_PER_ROW,
    } = useGameData();

    const { auth } = useAuth();

    function getPegRowID(rowIndex, pegIndex) {
        return "row"+rowIndex+".peg"+pegIndex;
    }

    function getHintRowID(rowIndex, hintIndex) {
        return "row"+rowIndex+".hint"+hintIndex;
    }

    let flag = true;

    useEffect(() => {
        if(flag) {
            const response = axiosPrivate.get(
                BACKEND_GET_MATCH_ENDPOINT,
                {params: {matchId: matchId}}
            );
            response.then(response => {
                const match = response.data.match;
                for (let rowIndex in match.attempts) {
                    for (let pegIndex in match.attempts[rowIndex].sequence) {
                        const peg = document.getElementById(getPegRowID(rowIndex, pegIndex));
                        peg.style.backgroundColor = match.attempts[rowIndex].sequence[pegIndex];
                    }
                    let hintIndex = 0;
                    while( hintIndex < PEGS_PER_ROW) {
                        const hint = document.getElementById(getHintRowID(rowIndex, hintIndex));
                        if(match.attempts[rowIndex].rightPositions > 0) {
                            hint.style.backgroundColor = "white";
                            match.attempts[rowIndex].rightPositions--;
                        } else if (match.attempts[rowIndex].rightColours > 0) {
                            hint.style.backgroundColor = "gray";
                            match.attempts[rowIndex].rightColours--;
                        }
                        hintIndex++;
                    }
                }
                //TO FIX
                setCurrentRow("row" + (match.attempts.length));
            })
            flag = false;
        }
    }, [flag]);



    const handleSubmitRow = async () => {
        if (currentPegsColor.size !== 4) {
            enqueueSnackbar(
                `Complete a row with all the ${PEGS_PER_ROW} colors before submitting the attempt`,
                { variant: "info", autoHideDuration: 3000 }
            );
            return;
        }

        let pegs = new Map(currentPegsColor);
        const sequence = Array.from(pegs.values());

        try {
            const username = auth.username;
            const response = await axiosPrivate.put(
                BACKEND_DO_GUESS_ENDPOINT,
                {username, matchId, sequence}
            );

            const {rightC, rightP, status} = response.data;
            setExactMatches(rightP);
            setColorMatches(rightC);
            setCurrentPegsColor(new Map());
            setCurrentRow((prevRow) => {
                return prevRow + 1;
            });
            console.log(status);
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
                            <DecodeRow key={index} rowID={"row" + index} />
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
                    disabled={currentRow === NUMBER_OF_ATTEMPTS}
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
