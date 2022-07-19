import { Box, Stack, Button } from "@mui/material";
import BackButton from "./BackButton";
import DecodeRow from "./DecodeRow";
import ColorSelector from "./ColorSelector";
import useGameData from "../hooks/useGameData";
import { useEffect, useState } from "react";
import { useSnackbar } from "notistack";

const GameBoard = () => {
    const { enqueueSnackbar } = useSnackbar();

    const colorSequence = new Map();
    colorSequence.set(0, "gold");
    colorSequence.set(1, "forestgreen");
    colorSequence.set(2, "coral");
    colorSequence.set(3, "gold");

    const {
        currentPegsColor,
        setCurrentPegsColor,
        currentRow,
        setCurrentRow,
        setExactMatches,
        setColorMatches,
        setEndGame,
        success,
        setSuccess,
        NUMBER_OF_ATTEMPTS,
        PEGS_PER_ROW,
    } = useGameData();

    useEffect(() => {
        if (success) enqueueSnackbar("You Won!", { variant: "success" });
    }, [success]);

    const handleSubmitRow = () => {
        if (currentPegsColor.size !== 4) {
            enqueueSnackbar(
                `Complete a row with all the ${PEGS_PER_ROW} colors before submitting the attempt`,
                { variant: "info", autoHideDuration: 3000 }
            );
            return;
        }

        let code = new Map(colorSequence);
        let pegs = new Map(currentPegsColor);
        let foundKey;
        let exactMatches = 0;
        let colorMatches = 0;

        // function used to check whether a given color is present inside the current guess
        const keyOf = (map, colorToFind) => {
            for (let [pegID, color] of map) {
                if (colorToFind === color) {
                    return pegID;
                }
            }

            return -1;
        };

        // First pass: Look for both value and position matches
        // Safely remove items if they match
        for (let [pegID, color] of pegs) {
            if (color === code.get(pegID)) {
                exactMatches++;
                pegs.delete(pegID);
                code.delete(pegID);
            }
        }

        // Second pass: Look for color matches anywhere in the current guess
        for (let [_, color] of pegs) {
            // attempt to find the peg in the remaining code
            foundKey = keyOf(code, color);
            if (foundKey !== -1) {
                colorMatches++;
                // remove the matched code peg, since it's been matched
                code.delete(foundKey);
            }
        }

        if (exactMatches === PEGS_PER_ROW) {
            setEndGame(true);
            setSuccess(true);
        } else if (currentRow + 1 === NUMBER_OF_ATTEMPTS) {
            setEndGame(true);
        }

        // Updating state
        setExactMatches(exactMatches);
        setColorMatches(colorMatches);
        setCurrentPegsColor(new Map());
        setCurrentRow((prevRow) => {
            return prevRow + 1;
        });

        console.log("Exact matches ->", exactMatches);
        console.log("Color matches ->", colorMatches + "\n");
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
