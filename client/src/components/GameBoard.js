import { Box, Stack, Button } from "@mui/material";
import BackButton from "./BackButton";
import DecodeRow from "./DecodeRow";
import ColorSelector from "./ColorSelector";
import useGameData from "../hooks/useGameData";
import { useSnackbar } from "notistack";

const GameBoard = () => {
    const {
        selectedColor,
        setSelectedColor,
        currentPegsColor,
        currentRow,
        setCurrentRow,
        NUMBER_OF_ATTEMPTS,
        PEGS_PER_ROW,
    } = useGameData();

    const { enqueueSnackbar } = useSnackbar();

    const handleSubmitRow = (_) => {
        if (currentPegsColor.size !== 4) {
            enqueueSnackbar(
                `Complete a row with all the ${PEGS_PER_ROW} colors before submitting the attempt`,
                { variant: "info" }
            );
            return;
        }

        Array(PEGS_PER_ROW)
            .fill()
            .forEach((_, index) =>
                console.log(
                    `Peg [${index + 1}] - ${currentPegsColor.get(index)}`
                )
            );

        currentPegsColor.clear();
        setCurrentRow((prevValue) => {
            return (prevValue + 1) % 10;
        });
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
                            <DecodeRow
                                currentRow={currentRow}
                                key={index}
                                rowID={index}
                                selectedColor={selectedColor}
                            />
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
                <ColorSelector
                    selectedColor={selectedColor}
                    setSelectedColor={setSelectedColor}
                />
                <Button
                    sx={{
                        width: "100%",
                        border: "1px solid white",
                        borderRadius: "5px",
                    }}
                    variant="contained"
                    color="neutral"
                    onClick={handleSubmitRow}
                >
                    Send Attempt
                </Button>
            </Box>
            <div style={{ height: "8px" }}></div>
            <Button onClick={(e) => console.log(currentPegsColor)}>Clck</Button>
        </>
    );
};

export default GameBoard;
